/**
 * @fileoverview NodeからMariaDBを利用する練習用のモジュール
 * 参考:
 * https://mariadb.com/kb/en/library/getting-started-with-the-nodejs-connector/
 * https://www.npmjs.com/package/mariadb
 */

/* eslint-disable no-undef */

const mariadb = require('mariadb');

const { db } = require('../../config');

const pool = mariadb.createPool(db);

class MariaDBSupport {
  constructor({ schema, table, key }) {
    this.schema = schema;
    this.table = table;
    this.key = key;
  }

  get tableName() {
    return `${this.schema}.${this.table}`;
  }

  async execute({ method, keys, values, columnNames, nometa }) {
    let connection, result;
    try {
      connection = await pool.getConnection();
      const func = this[method.toLowerCase()];
      if (typeof func === 'function') {
        const f = func.bind(this, 
          { keys, values, columnNames, connection, nometa });
        result = await f();
      } else {
        throw new Error(`Unsupported method: ${method}`);
      }
    } finally {
      connection && connection.end();
    }
    return result;
  }

  // 以下のメソッドはprivateメソッドにする方が良い。
  // #insert = async ({ values, connection }) => { ... };

  condition({ keys }) {
    return new Array(keys.length).fill(`${this.key}=?`).join(' AND ');
  }

  columns({ columnNames }) {
    return columnNames.map(name => `${name}=?`).join(',');
  }

  async insert({ values, connection }) {
    const p = new Array(values.length).fill('?').join(',');
    return await connection.query(`INSERT INTO ${this.tableName} 
    VALUES(${p})`,
      values);
  }

  async select({ keys, columnNames, connection, nometa }) {
    const result =  await connection.query(`SELECT ${columnNames.join(',')}  
    FROM ${this.tableName} 
    WHERE ${this.condition({ keys })}`,
      keys);
    if (nometa) {
      delete result.meta;
    }
    return result;
  }

  async update({ keys, columnNames, values, connection }) {
    return await connection.query(`UPDATE ${this.tableName} 
    SET ${this.columns({ columnNames })} 
    WHERE ${this.condition({ keys })}`,
      values.concat(keys));
  }

  async delete({ keys, connection }) {
    return await connection.query(`DELETE FROM ${this.tableName} 
    WHERE ${this.condition({ keys })}`,
      keys);
  }
}

const runTest = () => {
  const schema = 'test',
    table = 'authors',
    key = 'id';

  const ms = new MariaDBSupport({ schema, table, key });

  const ins = async () => await ms.execute({
    method: 'insert',
    values: ['A001', '𩸽を𠮟る𠮷野家']
  }), sel = async () => await ms.execute({
    method: 'select',
    keys: ['A001'],
    columnNames: ['name'],
    nometa: true
  }), upd = async () => await ms.execute({
    method: 'update',
    keys: ['A001'],
    columnNames: ['name'],
    values: ['Usao']
  }), del = async () => await ms.execute({
    method: 'delete',
    keys: ['A001']
  }), peek = result => {
    console.log(result);
    return result;
  };

  ins().then(peek)
    .then(sel).then(peek)
    .then(upd).then(peek)
    .then(del).then(peek)
    .catch(err => {
      console.error(err.message)
    }).finally(() => {
      process.exit(0);
    });
};

setImmediate(runTest);

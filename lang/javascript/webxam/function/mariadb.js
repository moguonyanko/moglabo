/**
 * @fileoverview NodeからMariaDBを利用する練習用のモジュール
 * 参考:
 * https://mariadb.com/kb/en/library/getting-started-with-the-nodejs-connector/
 * https://www.npmjs.com/package/mariadb
 */

/* eslint-disable no-undef */

const mariadb = require('mariadb');

const { db } = require('../config');

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

  async insert({ values }) {
    let con, result;
    try {
      con = await pool.getConnection();
      let p = new Array(values.length).fill('?').join(',');
      result = await con.query(`INSERT INTO ${this.tableName} VALUES(${p})`,
        values);
    } finally {
      con && con.end();
    }
    return result;
  }

  async select({ values }) {
    let con, result;
    try {
      con = await pool.getConnection();
      result = await con.query(`SELECT * FROM ${this.tableName} WHERE ${this.key}=?`, values);
    } finally {
      con && con.end();
    }
    return result;
  }

  // TODO: update, delete
}

const runTest = async () => {
  const schema = 'test',
    table = 'authors',
    key = 'id',
    values = ['A001', '𩸽を𠮟る𠮷野家'];

  const ms = new MariaDBSupport({ schema, table, key });

  try {
    const insertResult = await ms.insert({ values });
    console.log(insertResult);
    const selectResult = await ms.select({ values: ['A001'] });
    console.log(selectResult);
  } catch (err) {
    console.error(err.message);
  }

  process.exit(0);
};

setImmediate(async () => await runTest());

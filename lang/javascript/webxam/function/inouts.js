/**
 * @fileoverview 入出力系ユーティリティ関数を含むモジュール
 */

/* eslint-env node */

const fs = require('fs');

class Inouts {
  static readFile(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      })
    });
  }
}

module.exports = Inouts;

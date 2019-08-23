/**
 * @fileoverview 証明書関連モジュール
 */

/* eslint-env node */

const Inouts = require('./inouts');
const config = require('../config');

class Certs {
  static getOptions() {
    return new Promise((resolve, reject) => {
      Promise.all([
        Inouts.readFile(config.path.certificate.key),
        Inouts.readFile(config.path.certificate.cert)
      ]).then(allData => {
        const options = {
          key: allData[0],
          cert: allData[1],
          allowHTTP1: true // WebサーバからNodeに転送しつつHTTP/2を利用する際に必要
        };
        resolve(options);
      }).catch(reject);
    });
  }
}

module.exports = Certs;
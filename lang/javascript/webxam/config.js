/**
 * @fileoverview 共通設定モジュール
 * 
 * TODO:
 * convictモジュールを使用する。
 * https://www.npmjs.com/package/convict/v/1.0.1
 */

/* eslint-env node */
 
const config = {
  path: {
    certificate: {
      key: '/usr/local/etc/nginx/cert2.key',
      cert: '/usr/local/etc/nginx/cert2.crt'
    }
  },
  port: {
    webxamplain: 3443,
    practicenode: 4443
  }
};

module.exports = config;

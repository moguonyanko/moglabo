/**
 * @fileoverview 共通設定モジュール
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
    practicenode: 4443,
    mysocket: 5443
  },
  db: {
    host: 'localhost',
    user: 'sampleuser',
    password: 'samplepass',
    connectionLimit: 5
  },
  cors: {
    whitelist: ['https://localhost']
  } 
};

module.exports = config;

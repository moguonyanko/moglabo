/**
 * @fileoverview
 * ヘッドレスChromeでテストを行うための設定
 * 参考:
 * https://angular.jp/guide/testing
 */

const { config } = require('./protractor.conf');

config.capabilities = {
  browserName: 'chrome',
  chromeOptions: {
    args: ['--headless', '--no-sandbox']
  }
};

exports.config = config;

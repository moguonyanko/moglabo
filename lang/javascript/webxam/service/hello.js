/**
 * @fileOverview サンプル関数
 */

exports.hello = {
  getResult() {
    return {
      value: 'Hello Node!'
    }
  },
  getContentType() {
    return 'application/json';
  }
};

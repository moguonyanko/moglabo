/**
 * @fileOverview サンプル関数
 */

exports.hello = {
  get result() {
    return {
      value: 'Hello Node!'
    }
  },
  get contentType() {
    return 'application/json';
  }
};

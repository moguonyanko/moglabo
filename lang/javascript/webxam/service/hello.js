/**
 * @fileOverview サンプル関数
 */

exports.hello = () => {
  return {
    get result() {
      return {
        value: 'Hello Node!'
      }
    },
    get contentType() {
      return 'application/json';
    }
  };
};

/**
 * @fileOverview サンプル関数
 */

/*eslint no-undef: "error"*/
/*eslint-env node*/

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

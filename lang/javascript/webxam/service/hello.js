/**
 * @fileOverview サンプル関数
 */

/*eslint no-undef: "error"*/
/*eslint-env node*/

class Hello {
  constructor(request) {
    this.request = request;
  }

  get result() {
    return {
      value: 'Hello Node!'
    }
  }

  get contentType() {
    return 'application/json';
  }
}

module.exports = Hello;

/**
 * @fileOverview サンプル関数
 */

/*eslint no-undef: "error"*/
/*eslint-env node*/

class Hello {
  constructor() {
    this.contentType = 'application/json';
  }

  execute({ response }) {
    const json = {
      value: 'Hello Node!'
    };
    response.write(JSON.stringify(json));
  }
}

module.exports = Hello;

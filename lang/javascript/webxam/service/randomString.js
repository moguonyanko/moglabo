/**
 * @fileOverview ランダムな文字列を返すモジュール
 * 参考: Node.jsデザインパターン第2版
 */

/*eslint no-undef: "error"*/
/*eslint-env node*/

const Chance = require('chance');
const url = require('url');

class RandomString {
  constructor() {
    this.chance = new Chance();
    this.contentType = 'text/plain';
  }

  execute({ request, response }) {
    const query = url.parse(request.url, true).query;
    const paramLimit = parseInt(query.linelimit);
    const lineLimit = !isNaN(paramLimit) ? paramLimit : 10;
    let currentLine = 0;
    while (this.chance.bool({ likelihood: 95 })) {
      response.write(`${this.chance.string()}`);
      currentLine += 1;
      if (currentLine >= lineLimit) {
        break;
      }
      response.write(`\n`);
    }
  }
}

module.exports = RandomString;

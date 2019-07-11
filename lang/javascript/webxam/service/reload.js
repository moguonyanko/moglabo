/**
 * @fileOverview 現在のページを再表示するだけのモジュール
 */

/* eslint no-undef: "error" */
/* eslint-env node */

class Reload {
  constructor() {
    this.contentType = 'application/json';
  }

  execute({ request, response }) {
    const json = {
      status: 200
    };
    const currentPage = request.headers['referer'];
    response.writeHead(301, { "Location": currentPage });
    response.write(JSON.stringify(json));
  }
}

module.exports = Reload;

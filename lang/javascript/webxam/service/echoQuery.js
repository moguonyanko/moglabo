/**
 * @fileOverview サンプル関数
 */

/*eslint no-undef: "error"*/
/*eslint-env node*/

const url = require('url');

class EchoQuery {
    constructor() {
        this.contentType = 'application/json';
    }

    execute({ request, response }) {
        const result = {
            // url.parseは古いAPIのようである。
            // しかし同等の結果を同等の手順で得られるAPIが見つからない。
            // https://nodejs.org/dist/latest-v12.x/docs/api/url.html
            value: url.parse(request.url, true).search
        };
        response.write(JSON.stringify(result));
    }
}

module.exports = EchoQuery;

/**
 * @fileOverview サンプル関数
 */

/*eslint no-undef: "error"*/
/*eslint-env node*/

class EchoQuery {
    constructor(request) {
        this.request = request;
    }

    get result() {
        return {
            // url.parseは古いAPIのようである。
            // しかし同等の結果を同等の手順で得られるAPIが見つからない。
            // https://nodejs.org/dist/latest-v12.x/docs/api/url.html
            value: require('url').parse(this.request.url, true).search
        }
    }

    get contentType() {
        return 'application/json';
    }
}

module.exports = EchoQuery;

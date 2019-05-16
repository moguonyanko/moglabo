/**
 * @fileOverview サンプル関数
 */

/*eslint no-undef: "error"*/
/*eslint-env node*/

exports.echoQuery = {
    getResult({ url }) {
        return {
            // url.parseは古いAPIのようである。
            // しかし同等の結果を同等の手順で得られるAPIが見つからない。
            // https://nodejs.org/dist/latest-v12.x/docs/api/url.html
            value: require('url').parse(url, true).search
        }
    },
    getContentType() {
        return 'application/json';
    }
};

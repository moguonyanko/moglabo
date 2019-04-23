/**
 * @fileOverview WebXam調査用メインサーバ
 * 参考: https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
 * @todo
 * JSON以外のレスポンス対応
 */

const http = require('http');
const manager = require('./manager');

const handleError = err => console.error(err);

http.createServer((request, response) => {
  const srv = manager.getService(request);
  const body = srv.result;

  request.on('error', handleError).on('data', chunk => {
    // このブロックがないとレスポンスが返されずブロックされたままになる。
    // バイナリを返す時以外は何もしなくてよい？
    //body.push(chunk);
  }).on('end', () => {
    // バイナリを返す時に使う？
    //body = Buffer.concat(body).toString();

    response.on('error', handleError);

    response.statusCode = 200;
    response.setHeader('Content-Type', srv.contentType);
    if (srv.contentType.includes('json')) {
      response.write(JSON.stringify(body));
    } else {
      response.write(body);
    }
    response.end();
  });

}).listen(3000);

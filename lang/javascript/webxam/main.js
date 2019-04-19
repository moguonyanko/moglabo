/**
 * @fileOverview WebXam調査用メインサーバ
 * 参考: https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
 * @todo
 * JSON以外のレスポンス対応
 */

const http = require('http');
const service = require('./service');

const handleError = err => console.error(err);

http.createServer((request, response) => {
  const srv = service.getService(request);
  const body = srv();

  request.on('error', handleError).on('data', chunk => {
    // このブロックがないとレスポンスが返されずブロックされたままになる。
    // バイナリを返す時以外は何もしなくてよい？
    //body.push(chunk);
  }).on('end', () => {
    // バイナリを返す時に使う？
    //body = Buffer.concat(body).toString();

    response.on('error', handleError);

    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify(body));
    response.end();
  });

}).listen(3000);

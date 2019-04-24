/**
 * @fileOverview WebXam調査用メインサーバ
 * 参考: https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
 * @todo
 * JSON以外のレスポンス対応
 */

const http = require('http');
const manager = require('./manager');

const handleError = err => console.error(err);

http.createServer(async (request, response) => {
  const srv = manager.getService(request);
  const body = await srv.getResult();
  const contentType = srv.getContentType();

  request.on('error', handleError).on('data', chunk => {
    // このブロックがないとレスポンスが返されずブロックされたままになる。
    console.log(chunk);
  }).on('end', () => {
    response.on('error', handleError);

    response.statusCode = 200;
    response.setHeader('Content-Type', contentType);
    if (contentType.includes('json')) {
      response.write(JSON.stringify(body));
    } else {
      response.write(body);
    }
    response.end();
  });

}).listen(3000);

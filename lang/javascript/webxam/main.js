/**
 * @fileOverview WebXam調査用メインサーバ
 * 参考: https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
 */

/*eslint no-undef: "error"*/
/*eslint-env node*/

const http = require('http');
const manager = require('./manager');

const isTextResponse = contentType => {
  return contentType.includes('text') ||
    contentType.includes('json') ||
    contentType.includes('xml');
};

const createBody = async (service, response) => {
  let body;
  try {
    body = await service.getResult();
  } catch (err) {
    // request.on('error', () => {}); に該当する処理のつもり
    console.error(err);
    response.statusMessage = err.message;
    if (!isNaN(parseInt(err.statusCode))) {
      response.statusCode = err.statusCode;
    } else {
      response.statusCode = 502;
    }
    throw err;
  }
  return body;
};

http.createServer(async (request, response) => {
  const service = manager.getService(request);
  let body;
  try {
    body = await createBody(service, response);
  } catch (err) {
    response.end();
    // returnしないとエラー時にサーバが終了する。
    return;
  }
  const contentType = service.getContentType();

  response.on('error', err => console.error(err));

  request.on('data', chunk => {
    // このブロックがないとレスポンスが返されずブロックされたままになる。
  }).on('end', () => {
    response.statusCode = 200;
    response.setHeader('Content-Type', contentType);
    if (isTextResponse(contentType)) {
      response.write(JSON.stringify(body));
    } else {
      response.write(body);
    }
    response.end();
  });

}).listen(3000);

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

// request.on('error', () => {}); に該当する処理のつもり
const handleBodyError = (err, response) => {
  console.error(err);
  response.statusMessage = err.message;
  if (!isNaN(parseInt(err.statusCode))) {
    response.statusCode = err.statusCode;
  } else {
    response.statusCode = 500;
  }
  response.end();
};

const handleNotServiceError = (err, response) => {
  console.error(err);
  if (err instanceof manager.NotFoundServiceError) {
    response.statusCode = 404;
  } else {
    response.statusCode = 503;
  }
  response.end();
};

http.createServer(async (request, response) => {
  let service;
  try {
    service = manager.getService(request);
  } catch (err) {
    handleNotServiceError(err, response);
    return;
  }

  let body;
  try {
    body = await service.getResult();
  } catch (err) {
    handleBodyError(err, response);
    return;
  }

  response.on('error', err => console.error(err));

  // dataイベントの処理が記述されていないとレスポンスが返されずブロックされたままになる。
  request.on('data', chunk => chunk).on('end', () => {
    const contentType = service.getContentType();
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

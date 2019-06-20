/**
 * @fileOverview WebXam調査用メインサーバ
 * 参考: https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
 */

/* eslint no-undef: "error" */
/* eslint-env node */

const http = require('http');
const serviceLoader = require('./serviceLoader');

// request.on('error', () => {}); に該当する処理のつもり
const handleError = ({ error, response }) => {
  console.error(error);
  response.statusMessage = error.message;
  if (!isNaN(parseInt(error.statusCode))) {
    response.statusCode = error.statusCode;
  } else {
    response.statusCode = 500;
  }
};

http.createServer(async (request, response) => {
  response.on('error', err => console.error(err));

  try {
    const service = serviceLoader(request);
    response.setHeader('Content-Type', service.contentType);
    await service.execute({ request, response });
    response.statusCode = 200;
  } catch (error) {
    handleError({ error, response });
  } finally {
    response.end();
  }
}).listen(3000);

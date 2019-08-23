/**
 * @fileOverview WebXam調査用メインサーバ
 * 参考: https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
 */

/* eslint no-undef: "error" */
/* eslint-env node */

const http2 = require('http2');

const serviceLoader = require('./serviceLoader');
const Certs = require('./function/certs');
const config = require('./config');

const port = config.port.webxamplain;

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

const getBody = ({ request }) => {
  const promise = new Promise((resolve, reject) => {
    const body = [];
    request.on('data', chunk => {
      body.push(chunk);
    });
    request.on('error', error => {
      reject(error);
    });
    request.on('end', () => {
      resolve(Buffer.concat(body));
    });
  });
  return promise;
};

const setContentType = ({ response, service }) => {
  const types = [...service.contentType.matchAll(/(image)|(pdf)/g)];
  if (types.length > 0) {
    response.setHeader('Content-Type', `${service.contentType}`);
  } else {
    response.setHeader('Content-Type', `${service.contentType}; charset=UTF-8`);
  }
};

const startWebXamServer = options => {
  http2.createSecureServer(options, async (request, response) => {
    response.on('error', err => console.error(err));

    try {
      const service = serviceLoader(request);
      setContentType({ response, service });
      if (request.method === 'POST') {
        const body = await getBody({ request });
        await service.execute({ request, response, body });
      } else {
        await service.execute({ request, response });
      }
      response.statusCode = 200;
    } catch (error) {
      handleError({ error, response });
    } finally {
      response.end();
    }
  }).listen(port);
};

const main = () => {
  Certs.getOptions().then(options => {
    startWebXamServer(options);
    console.info(`WebXam server listen by ${port}`);
  });
};

main();

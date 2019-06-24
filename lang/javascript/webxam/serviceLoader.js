/**
 * @fileOverview リクエストされたサービスを読み込むモジュール
 */

/* eslint no-undef: "error" */
/* eslint-env node */

const URLs = require('./function/urls');

class NotFoundServiceError extends Error {
  constructor(url) {
    super(`Not Found Service: ${url}`);
  }

  get statusCode() {
    return 404;
  }
}

module.exports = request => {
  const basePath = '/service/';
  const urls = new URLs(request.url);
  const paths = urls.pathname.split(basePath);
  if (paths.length > 1) {
    const name = [paths[1]];
    const Service = require(`.${basePath}${name}`);
    if (typeof Service === 'function') {
      return new Service(request);
    } else {
      throw new NotFoundServiceError(request.url);
    }
  } else {
    throw new NotFoundServiceError(request.url);
  }
};

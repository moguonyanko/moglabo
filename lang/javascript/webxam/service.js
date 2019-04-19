/**
 * @fileOverview サーブレット的な関数群を提供するスクリプト
 */

const greeting = require('./hello');

const service = {
  hello: greeting.hello
};

for (let srv in service) {
  exports[srv] = service[srv];
}

class NotFoundServiceError extends Error {
  constructor(url) {
    super(`Not Found Service: ${url}`);
  }
}

exports.getService = ({url}) => {
  const paths = url.split('/service/');
  if (paths.length > 1 && typeof service[paths[1]] === 'function') {
    return service[paths[1]];
  } else {
    throw new NotFoundServiceError(url);
  }
};

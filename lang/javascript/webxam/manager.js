/**
 * @fileOverview サーブレット的な関数群を提供するスクリプト
 */

class NotFoundServiceError extends Error {
  constructor(url) {
    super(`Not Found Service: ${url}`);
  }
}

exports.getService = ({url}) => {
  const basePath = '/service/';
  const paths = url.split(basePath);
  if (paths.length > 1) {
    const serviceName = [paths[1]],
        service = require(`.${basePath}${serviceName}`)[serviceName];
    if (typeof service === 'function') {
      return service();
    } else {
      throw new NotFoundServiceError(url);
    }
  } else {
    throw new NotFoundServiceError(url);
  }
};

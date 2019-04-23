/**
 * @fileOverview サーブレット的な関数群を管理するスクリプト
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
    const name = [paths[1]];
    const service = require(`.${basePath}${name}`);
    if (typeof service[name] === 'object') {
      return service[name];
    } else {
      throw new NotFoundServiceError(url);
    }
  } else {
    throw new NotFoundServiceError(url);
  }
};

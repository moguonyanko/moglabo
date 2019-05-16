/**
 * @fileOverview サーブレット的な関数群を管理するスクリプト
 */

/*eslint no-undef: "error"*/
/*eslint-env node*/

// URLコンストラクタ呼び出しでエラーを発生させないためだけのオリジン
// スキームやホストがURLに含まれていないとエラーになる。ブラウザ側のURLでも同様。
// リクエストからオリジンを取得する方法があれば要らないはずである。
const dummyOrigin = 'http://localhost';

class NotFoundServiceError extends Error {
  constructor(url) {
    super(`Not Found Service: ${url}`);
  }
}

exports.getService = ({ url }) => {
  const basePath = '/service/';
  const u = new URL(url, dummyOrigin);
  const paths = u.pathname.split(basePath);
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

exports.NotFoundServiceError = NotFoundServiceError;

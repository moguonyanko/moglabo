/**
 * @fileoverview URLのクエリ部分を処理するモジュール
 */

/* eslint no-undef: "error" */
/* eslint-env node */

// URLコンストラクタ呼び出しでエラーを発生させないためだけのオリジン
// スキームやホストがURLに含まれていないとエラーになる。ブラウザ側のURLでも同様。
// リクエストからオリジンを取得する方法があれば要らないはずである。
const dummyOrigin = 'https://localhost';

const validSchemes = [
  'http', 'https', 'ws', 'wss'
];

class URLs {
  constructor(url) {
    if (validSchemes.some(scheme => url.startsWith(scheme))) {
      this.url = new URL(url);
    } else {
      this.url = new URL(`${dummyOrigin}/${url}`);
    }
  }

  getParameter(name, defaultValue) {
    if (this.url.searchParams.has(name)) {
      return this.url.searchParams.get(name);
    } else {
      return defaultValue;
    }
  }

  get pathname() {
    return this.url.pathname;
  }

  get origin() {
    return this.url.origin;
  }
}

// eslint-disable-next-line no-unused-vars
const runTest = () => {
  const urls = new URLs('https://localhost/webxam/samplerequest?a=1&b=2');
  console.log(`a=${urls.getParameter('a')},b=${urls.getParameter('b')}`);
  console.log(`pathname: ${urls.getPathName()}`);
};

//runTest();

module.exports = URLs;

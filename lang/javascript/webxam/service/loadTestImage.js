/**
 * @fileOverview テスト用画像をダウンロードするシンプルな関数
 */

/*eslint no-undef: "error"*/
/*eslint-env node*/

const fs = require('fs');

class TestImageLoader {
  constructor(request) {
    this.request = request;
  }

  get result() {
    return new Promise((resolve, reject) => {
      fs.readFile('./image/testimage.png', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  get contentType() {
    return 'image/png';
  }
}

module.exports = TestImageLoader;

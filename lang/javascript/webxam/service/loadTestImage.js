/**
 * @fileOverview テスト用画像をダウンロードするシンプルな関数
 */

/*eslint no-undef: "error"*/
/*eslint-env node*/

const fs = require('fs');

class TestImageLoader {
  constructor() {
    this.contentType = 'image/png';
  }

  async execute({ response }) {
    const promise = new Promise((resolve, reject) => {
      fs.readFile('./image/testimage.png', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
    const img = await promise;
    response.write(img);
  }
}

module.exports = TestImageLoader;

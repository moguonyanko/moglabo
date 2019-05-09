/**
 * @fileOverview テスト用画像をダウンロードするシンプルな関数
 */

/*eslint no-undef: "error"*/
/*eslint-env node*/

const fs = require('fs');

exports.loadTestImage = {
  getResult() {
    return new Promise((resolve, reject) => {
      fs.readFile('./image/testimage.png', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  },
  getContentType() {
    return 'image/png';
  }
};

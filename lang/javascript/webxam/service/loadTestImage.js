/**
 * @fileOverview テスト用画像をダウンロードするシンプルな関数
 */
const fs = require('fs');

exports.loadTestImage = {
  async getResult() {
    return await fs.readFileSync('./image/testimage.png');
  },
  getContentType() {
    return 'image/png';
  }
};

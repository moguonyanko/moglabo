/**
 * @fileoverview Shape Detection API調査用モジュール
 */

const textDetector = new TextDetector();
const barcodeDetector = new BarcodeDetector({
  formats: [
    'aztec',
    'code_128',
    'code_39',
    'code_93',
    'codabar',
    'data_matrix',
    'ean_13',
    'ean_8',
    'itf',
    'pdf417',
    'qr_code',
    'upc_a',
    'upc_e'
  ]
});

// detectにFileやArrayBufferを渡すとエラー。Blobでラップしてもダメ。
const detectors = {
  text: async data => {
    const detectedTexts = await textDetector.detect(data);
    return detectedTexts;
  },
  barcode: async data => {
    const results = await barcodeDetector.detect(data);
    return results;
  }
};

// 個々のプロパティの上書きも防ぐにはconstだけでなくfreezeが必要。
Object.freeze(detectors);

export default detectors;

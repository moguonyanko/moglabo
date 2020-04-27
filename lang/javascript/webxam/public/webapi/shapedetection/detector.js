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
const faceDetector = new FaceDetector({
  maxDetectedFaces: 3, // 認識する顔の数の上限
  fastMode: false 
});

// detectにFileやArrayBufferを渡すとエラー。Blobでラップしてもダメ。
const detectors = {
  text: async data => await textDetector.detect(data),
  barcode: async data => await barcodeDetector.detect(data),
  face: async data => await faceDetector.detect(data)
};

// 個々のプロパティの上書きも防ぐにはconstだけでなくfreezeが必要。
Object.freeze(detectors);

export default detectors;

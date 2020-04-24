/**
 * @fileoverview Shape Detection API調査用モジュール
 */

const detectors = {
  text: async data => {
    const detector = new TextDetector();
    // detectにFileやArrayBufferを渡すとエラー。Blobでラップしてもダメ。
    const detectedTexts = await detector.detect(data);
    return detectedTexts;
  }
};

export default detectors;

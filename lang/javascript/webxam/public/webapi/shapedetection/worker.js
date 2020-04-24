/**
 * @fileoverview Shape Detection Worker
 */

import detectors from './detector.js';

self.addEventListener('message', async event => {
  const { data } = event;
  // 今のところTextDetector固定
  const results = await detectors.text(data);
  self.postMessage(results);
});

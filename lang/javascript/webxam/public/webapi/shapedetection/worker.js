/**
 * @fileoverview Shape Detection Worker
 */

import detectors from './detector.js';

self.addEventListener('message', async event => {
  const { type, target } = event.data;
  if (typeof detectors[type] !== 'function') {
    throw new TypeError(`${type} is invalid detector type`);
  }
  const results = await detectors[type](target);
  self.postMessage(results);
});

/**
 * @fileoverview 受け取ったArrayBufferをそのまま返すだけのWorker
 */

self.onmessage = event => {
  self.postMessage(event.data);
};

/**
 * @fileoverview シンプルなWorkerサンプル用スクリプト
 */

self.addEventListener('message', event => {
  if (event.data) {
    self.postMessage(new Date(event.data));
  } else {
    self.postMessage('NO TIME');
  }
});

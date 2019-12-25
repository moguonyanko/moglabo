/**
 * @fileoverview シンプルなWorkerサンプル用スクリプト
 * strict modeにならないのでthisはDedicatedWorkerGlobalScopeになる。
 */

const toDate = time => new Date(time);
//importScripts('./time.js');

self.addEventListener('message', event => {
  console.log(`this = ${this}`);
  self.postMessage(toDate(event.data));
  //self.postMessage(MyTime.toDate(event.data));
});

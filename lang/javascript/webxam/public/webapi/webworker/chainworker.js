/**
 * @fileoverview Worker内でモジュールを読み込むサンプル
 * moduleとして読み込まれることでimportの使用が可能になる。
 * また自動的にstrict modeになる。
 */

import { MyTime } from './time.js';

self.addEventListener('message', event => {
  console.log(`this = ${this}`);
  self.postMessage(MyTime.toDate(event.data));
});

/**
 * @fileoverview メインスクリプトとWorkerでモジュールを
 * 共有するサンプルのためのスクリプト
 */

import { MyMath } from './math.js'; 

self.addEventListener('message', event => {
    // メインスクリプトと同じモジュールを使って計算を行う。
    // このWorkerがmoduleとして読み込まれていなければimportを
    // 使用することができないのでモジュールであるスクリプトを共有できない。
    // importScriptsで外部スクリプトを読み込む場合はスクリプトから
    // exportなどを除去する必要があるためモジュールのまま共有することができない。
    self.postMessage(MyMath.pow(event.data));
});

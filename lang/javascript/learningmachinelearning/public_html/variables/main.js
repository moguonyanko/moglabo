/**
 * ***ユーザー空間***
 * 
 * DOM層(ここ):
 *  アプリケーションのdocumentを直接参照または変更する層
 *  
 * ***ライブラリ空間***
 *  
 * CustomElements層:
 *  Custom Elementsを通してアプリケーションのdocumentを参照または変更する層
 * ECMA層:
 *  documentを参照せずECMAScriptだけで完結している層
 */

import sc from "./skewingcanvas.js";

const main = () => {
    customElements.define("skew-canvas", sc.SkewingCanvas);
    // define後でないとcustom elementのコンストラクタ呼び出しでエラーになる。
    //sc.test.runTest();
};

window.addEventListener("DOMContentLoaded", main);
window.addEventListener("unhandledrejection", err => console.error(err));

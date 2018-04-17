/**
 * @fileOverview TensorFlow.jsを用いるcustom elementのクライアント
 */

import el from "./element.js";
// クライアント側のスクリプトは以下のような絶対URLでモジュールを読み込むことが多いと思われる。
//import el from "//localhost/learningmachinelearning/modelsandlayers/element.js";
// content-security-policy: default-src 'self' の場合以下はエラーとなる。
//import el from "//172.20.10.2/learningmachinelearning/modelsandlayers/element.js";

const main = async () => {
    //el.test.runTest();

    const elementName = "tensor-formula";
    // custom componentのconnectedCallbackの方が先に呼び出される。
    customElements.whenDefined(elementName).then(() =>
        console.info(`${elementName} is ready`));
    customElements.define(elementName, el.FormulaElement);

    customElements.define("tensor-model", el.ModelElement);
};

window.addEventListener("DOMContentLoaded", main);
window.addEventListener("unhandledrejection", err => console.error(err));

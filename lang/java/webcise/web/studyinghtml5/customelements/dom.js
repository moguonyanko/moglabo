import mce from "./customelements.js";

const defineElements = () => {
    // custom elementの名前には必ずハイフンを含まなければならない。
    customElements.define("simple-list", mce.AutoList);
    customElements.define("repeat-paragraph", mce.RepeatParagraph, {extends: "p"});
};

const init = () => {
    // customElements.defineを呼び出す前にcustom elementのコンストラクタを
    // 呼び出すとTypeErrorになる。
    defineElements();
    //mce.test.runTest();
};

window.addEventListener("DOMContentLoaded", init);
window.addEventListener("unhandledrejection", err => console.error(err));

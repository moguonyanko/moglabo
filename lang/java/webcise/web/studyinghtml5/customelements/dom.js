import mce from "./customelements.js";

const defineElements = () => {
    // custom elementの名前には必ずハイフンを含まなければならない。
    customElements.define("simple-list", mce.AutoList);
    customElements.define("upper-paragraph", mce.UpperParagraph, {extends: "p"});
    customElements.define("calc-exec", mce.Calculator);

    customElements.define("programming-datalist", mce.ProgrammingList);
    // 無名classを使った定義も可能だがユーザー側のスクリプト(このスクリプト)に
    // コンポーネントの詳細を記述したコードが混ざってしまう。
    //customElements.define("programming-datalist", class extends HTMLElement {
    //    // implement 
    //});
    
    customElements.define("my-userdata", mce.MyUserData);
    customElements.define("my-menulist", mce.MyMenuList);
};

const addListener = () => {
    const ctrl = document.querySelector(".control");
    const options = {
        passive: true
    };
    const lhsEle = ctrl.querySelector(".lhs"),
        rhsEle = ctrl.querySelector(".rhs"),
        operatorEle = ctrl.querySelector(".operator");
    ctrl.addEventListener("change", event => {
        if (event.target.classList.contains("ev-target")) {
            event.stopPropagation();
            const {lhs, rhs, operator} = {
                lhs: lhsEle.value,
                rhs: rhsEle.value,
                operator: operatorEle.value
            };
            const calcEle = document.querySelector(".calculator");
            calcEle.setAttribute("lhs", lhs);
            calcEle.setAttribute("rhs", rhs);
            calcEle.setAttribute("operator", operator);
        }
    }, options);

    const resetter = ctrl.querySelector(".reset");
    resetter.addEventListener("click", event => {
        if (event.target.classList.contains("reset")) {
            event.stopPropagation();
            // resetするのにいちいち要素をremove&appendする必要はないのだが
            // custom elementのlifecycle callbacksを確認するために行なっている。
            const calcEle = document.querySelector(".calculator");
            const parent = calcEle.parentNode;
            parent.removeChild(calcEle);
            const newCalcEle = document.createElement("calc-exec");
            newCalcEle.setAttribute("lhs", 0);
            newCalcEle.setAttribute("rhs", 0);
            newCalcEle.setAttribute("operator", "+");
            parent.appendChild(newCalcEle);

            lhsEle.value = 0;
            rhsEle.value = 0;
            operatorEle.value = "+";
        }
    }, options);
};

const init = () => {
    // customElements.defineを呼び出す前にcustom elementのコンストラクタを
    // 呼び出すとTypeErrorになる。
    defineElements();
    addListener();
    //try {
    //    mce.test.runTest();
    //} catch (err) {
    //    console.error(err.message);
    //}
};

window.addEventListener("load", init);
// DOMContentLoadedを使うとiframeの読み込みが完了する前にイベントが発生してしまう。
//window.addEventListener("DOMContentLoaded", init);
window.addEventListener("unhandledrejection", err => console.error(err));

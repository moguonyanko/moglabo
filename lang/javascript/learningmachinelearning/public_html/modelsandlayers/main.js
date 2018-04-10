import el from "./element.js";

const main = async () => {
    //ml.test.runTest();
    const elementName = "tensor-formula";
    // custom componentのconnectedCallbackの方が先に呼び出される。
    customElements.whenDefined(elementName).then(() =>
        console.info(`${elementName} is ready`));
    customElements.define(elementName, el.FormulaElement);
};

window.addEventListener("DOMContentLoaded", main);
window.addEventListener("unhandledrejection", err => console.error(err));

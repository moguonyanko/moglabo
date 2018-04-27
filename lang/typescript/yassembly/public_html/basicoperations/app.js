import Operation from "./operation.js";

const init = () => {
    customElements.define("four-operarion", Operation);
};

// iframeでtemplateを読み込んでいるのでDOMContentLoadedではなくloadを使っている。
window.addEventListener("load", init);
window.addEventListener("unhandledrejection", err => console.error(err));

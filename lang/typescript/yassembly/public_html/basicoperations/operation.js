/**
 * @name operation
 * @fileOverview 四則演算モジュール
 */

let operations = null;

const initOperations = async () => {
    const response = await fetch("../bin/module.optimized.wasm");
    // レスポンスをArrayBufferに変換
    const bytes = await response.arrayBuffer();
    // ArrayBufferからインスタンスを生成
    const result = await WebAssembly.instantiate(bytes);
    // インスタンス内の公開オブジェクトの参照を取得
    operations = result.instance.exports;
};

const calc = ({params, operation}) => {
    if (typeof operations[operation] !== "function") {
        throw new TypeError(`Not support: ${operation}`);
    }
    const op = operations[operation];
    return op(params.lhs, params.rhs);
};

export default class extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({mode: "open"});

        const templateId = this.getAttribute("templateid");
        const templateLoadedFrame = document.getElementById(templateId);
        const framwDoc = templateLoadedFrame.contentWindow.document;
        const template = framwDoc.querySelector(".operationstemplate");
        const instance = template.content.cloneNode(true);

        const maxVal = parseFloat(this.getAttribute("max"));
        const minVal = parseFloat(this.getAttribute("min"));
        const params = instance.querySelectorAll(".param");
        Array.from(params).forEach(param => {
            if (!isNaN(maxVal)) {
                param.setAttribute("max", maxVal);
            }
            if (!isNaN(minVal)) {
                param.setAttribute("min", minVal);
            }
        });

        shadow.appendChild(instance);
    }

    displayResult(x) {
        const root = this.shadowRoot;
        const main = root.querySelector("main");
        const result = main.querySelector(".result");
        const resEle = document.createElement("span");
        resEle.setAttribute("id", "resultvalue");
        resEle.appendChild(document.createTextNode(x));
        const oldResEle = root.getElementById("resultvalue");
        if (oldResEle) {
            result.replaceChild(resEle, oldResEle);
        } else {
            result.appendChild(resEle);
        }
    }

    // パラメータの境界値などをユーザーから受け取りたい場合は属性を使うのが妥当。
    // slotはあくまでもユーザーのマークアップを挿入させる時に使う。
    // slotchangeイベントはコンポーネント初期化時には発生しないので属性の初期化には使えない。
    async connectedCallback() {
        if (operations === null) {
            await initOperations();
        }
        const root = this.shadowRoot;
        const main = root.querySelector("main");
        main.addEventListener("change", event => {
            if (event.target.classList.contains("evtarget")) {
                event.stopPropagation();
                const lhs = parseFloat(main.querySelector(".lhs").value);
                const rhs = parseFloat(main.querySelector(".rhs").value);
                if ([lhs, rhs].some(isNaN)) {
                    throw new TypeError(`Invalid parameter: lhs=${lhs},rhs=${rhs}`);
                }
                const params = {lhs, rhs};
                const operation = Array.from(main.querySelectorAll(".operation"))
                    .filter(el => el.checked)
                    .map(el => el.value)
                    .pop();
                const x = calc({params, operation});
                this.displayResult(x);
            }
        });
    }
}

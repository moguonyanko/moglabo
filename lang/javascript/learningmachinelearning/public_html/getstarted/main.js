import predict from "./predict.js";

let operations = {};

/**
 * 参考:
 * https://html5experts.jp/shumpei-shiraishi/24409/
 */
const initOperations = async () => {
    const response = await fetch("../bin/module.optimized.wasm");
    // レスポンスをArrayBufferに変換
    const bytes = await response.arrayBuffer();
    // ArrayBufferからインスタンスを生成
    const result = await WebAssembly.instantiate(bytes);
    // インスタンス内の公開オブジェクトの参照を取得
    operations = result.instance.exports;
};

const defineElement = () => {
    customElements.define("wasm-calculation", class extends HTMLElement {
        constructor() {
            super();

            const shadow = this.attachShadow({mode: "open"});
            const template = document.querySelector(".calc-template");
            shadow.appendChild(template.content.cloneNode(true));
        }

        // 本当はprivateであるべきだがprivate修飾子は存在しない。
        // defineElement関数の外側に出すこともできるが、custom elementで用いる
        // 関数はcustom elementを扱うコードの中に収めておきたい。
        async doCalc( {base, operator}) {
            if (typeof operations[operator] !== "function") {
                throw new TypeError(`Unsupported operator: ${operator}`);
            }
            const params = Array
                .from(base.querySelectorAll(".parameter"))
                .map(el => parseInt(el.value));
            if (params.some(isNaN)) {
                throw new TypeError("Cannot operate by NaN");
            }
            const x = operations[operator](...params);
            const result = base.querySelector(".result");
            result.innerHTML = x;
            // エラー情報のクリア
            this.reportError({base});
        }

        reportError( {base, error}) {
            const reportArea = base.querySelector(".report");
            if (error) {
                // LightDOMのdocumentから生成したNodeでもShadowDOMの要素以下に
                // 追加することができる。ただしLightDOMのdocumentにquerySelector
                // しても追加した要素を得ることはできない。
                const p = document.createElement("p");
                p.appendChild(document.createTextNode(`エラー発生:${error.message}`));
                reportArea.appendChild(p);
            } else {
                reportArea.innerHTML = "";
            }
        }

        connectedCallback() {
            const shadow = this.shadowRoot;
            const base = shadow.querySelector(".base");

            base.addEventListener("click", async event => {
                if (event.target.classList.contains("operator")) {
                    event.stopPropagation();
                    const operator = event.target.value;
                    try {
                        await this.doCalc({base, operator});
                    } catch (error) {
                        this.reportError({base, error});
                    }
                }
            });

            base.addEventListener("change", async event => {
                if (event.target.classList.contains("parameter")) {
                    event.stopPropagation();
                    const operator = Array.from(base.querySelectorAll(".operator"))
                        .filter(el => el.checked)
                        .map(el => el.value)
                        .pop();
                    try {
                        await this.doCalc({base, operator});
                    } catch (error) {
                        this.reportError({base, error});
                    }
                }
            });
        }
    });
};

const displaySampleResult = async () => {
    const result = await predict();

    const jsonResult = document.querySelector(".json");
    const json = document.createTextNode(JSON.stringify(result));
    jsonResult.appendChild(json);

    const toStringResult = document.querySelector(".toString");
    const str = document.createTextNode(result.toString());
    toStringResult.appendChild(str);

    const dataResult = document.querySelector(".data");
    const data = document.createTextNode(await result.data());
    dataResult.appendChild(data);
};

const init = async () => {
    defineElement();
    await displaySampleResult();
    await initOperations();
};

window.addEventListener("DOMContentLoaded", init);
window.addEventListener("unhandledrejection", err => console.error(err));

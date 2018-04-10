/**
 * @fileOverview 計算式を扱うCustomElementsを提供するモジュール
 */

import ml from "./modelsandlayers.js";

const createFormula = (base = document) => {
    const {a, b, c} = {
        a: parseFloat(base.querySelector(".scalar-a").value),
        b: parseFloat(base.querySelector(".scalar-b").value),
        c: parseFloat(base.querySelector(".scalar-c").value)
    };
    if (Object.values({a, b, c}).every(v => !isNaN(v))) {
        const formula = new ml.Formula({a, b, c});
        return formula;
    } else {
        throw new TypeError(`Invalid parameter: a=${a},b=${b},c=${c}`);
    }
};

const displayResult = async ({base = document, result}) => {
    const resultArea = base.querySelector(".result");
    resultArea.innerHTML = await result.data();
};

const getX = (base = document) => {
    const x = base.querySelector(".xvalue").value;
    return parseFloat(x);
};

const addListener = async ({inputs, outputs, initialFormula, initialX}) => {
    let formula = initialFormula,
        x = initialX;
    inputs.addEventListener("change", async event => {
        if (event.target.classList.contains("eventtarget")) {
            event.stopPropagation();
            // event.composedPath()でイベントが伝播したNodeの配列を確認できる。
            //console.info(event.composedPath());
            if (event.target.classList.contains("scalar")) {
                formula = createFormula(inputs);
            } else if (event.target.classList.contains("xvalue")) {
                x = getX(inputs);
            }
            await displayResult({base: outputs, result: formula.predict(x)});
        }
    });
};

class FormulaElement extends HTMLElement {
    constructor() {
        super();

        // custom elementのクライアントにshadowRootの参照を許可しない場合はclosedを指定する。
        // closedにするとこのファイル内からもShadowRootを参照できなくなる。
        const shadow = this.attachShadow({mode: "open"});
        
        // 方程式の各パラメータをcustom elementの属性から取得する。
        const a = this.getAttribute("initial-a");
        const b = this.getAttribute("initial-b");
        const c = this.getAttribute("initial-c");
        const x = this.getAttribute("initial-x");

        // ShadowDOMで読み込んだCSSはShadowDOM内の要素にしか適用されない。
        // ShadowDOMのidやclassはユーザーのDOM(LightDOM)と衝突しない。同じ値を用いても問題無い。
        // ShadowDOM内のインラインstyle要素もCSPのチェック対象となる。
        const html = `
        <div class="formula-container">
        <link rel="stylesheet" href="element.css" />
        <div class="inputs">
          <div class="scalars">
            <label>a=<input class="eventtarget scalar scalar-a" type="number" value="${a}" /></label>
            <label>b=<input class="eventtarget scalar scalar-b" type="number" value="${b}" /></label>
            <label>c=<input class="eventtarget scalar scalar-c" type="number" value="${c}" /></label>
          </div>
          <div>
            <label>x=<input class="eventtarget xvalue" type="number" value="${x}" /></label>
          </div>
        </div>
        <div class="outputs">
          <p>y=<span class="result"></span></p>
        </div>
        </div>
`;

        shadow.innerHTML += html;
    }

    async connectedCallback() {
        console.info(`connectedCallback: ${new Date().toLocaleString()}`);
        console.info(`要素が割り当てられたslot: ${this.assignedSlot}`);
        const root = this.shadowRoot;
        const inputs = root.querySelector(".inputs");
        const outputs = root.querySelector(".outputs");
        let formula = createFormula(inputs);
        let x = getX(inputs);
        addListener({
            inputs,
            outputs,
            initialFormula: formula,
            initialX: x
        });
        // 初期表示
        await displayResult({base: outputs, result: formula.predict(x)});
    }
}

const myElement = {
    FormulaElement
};

export default myElement;

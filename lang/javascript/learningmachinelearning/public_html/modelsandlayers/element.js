/**
 * @fileOverview 計算式を扱うCustomElementsを提供するモジュール
 */

import ml from "./modelsandlayers.js";

// Formula element

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
        // 
        // slot要素はユーザーがcustom elementの内部に記述した内容で置き換えられる。
        // ユーザーが何も記述しなかった時はslot要素の内部のテキストが出力される。
        // 置き換えられるとはいったもののユーザーが記述したコンテンツはShadowDOMとしては
        // 扱われていないようにデバッガ上では見える。あくまでもLightDOMなのかもしれない。
        // 少なくともユーザーがslot要素に対応して記述した要素のshadowRootはnullになっている。
        const html = `
        <div class="formula-container">
        <link rel="stylesheet" href="element.css" />
        <slot name="description">Example Formula</slot>
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
          <p class="resultcontainer">y=<span class="result"></span></p>
        </div>
        </div>
`;

        shadow.innerHTML += html;
    }

    async connectedCallback() {
        console.info(`connectedCallback: ${new Date().toLocaleString()}`);
        const root = this.shadowRoot;
        const inputs = root.querySelector(".inputs");
        const outputs = root.querySelector(".outputs");
        const slotted = root.querySelector("span[slot='description']");
        console.info(`要素が割り当てられたslot: ${slotted && slotted.assignedSlot}`);
        try {
            let formula = createFormula(inputs);
            let x = getX(inputs);
            addListener({
                inputs,
                outputs,
                initialFormula: formula,
                initialX: x
            });
            await displayResult({base: outputs, result: formula.predict(x)});
        } catch (err) {
            console.error(`初期表示失敗:${err.message}`);
        }
    }
}

// Model element

const sampleDataFactory = {
    ones(shape) {
        return tf.ones(shape);
    },
    zeros(shape) {
        return tf.zeros(shape);
    },
    uniform(shape) {
        return tf.randomUniform(shape);
    },
    normal(shape) {
        return tf.randomNormal(shape);
    }
};

/**
 * @private
 * @function
 * @name getSlottedValue
 * @argument {Object} 引数オブジェクト 
 * @param {String} selector valueを得る要素のセレクタ
 * @param {Node} shadowContainer slot置き換えが行われなかった時に
 * 参照される、ShadowDOM内の要素
 * @description slotで置き換えられた要素のvalueを返します。
 * 置き換えが行われなかった場合はShadowDOMに存在する元の要素を参照して
 * valueを返します。
 * slot属性を指定してユーザーが挿入したDOMはShadowDOM内には含まれません。
 * このDOMを参照するには現在のページのDocumentオブジェクトに対して
 * querySelectorなどが実行される必要があります。もちろんShadowDOMの要素は
 * 現在のページのDocumentに対するquerySelectorで参照することはできません。
 */
const getSlottedValue = ({selector, shadowContainer}) => {
    const node = document.querySelector(selector) ||
        shadowContainer.querySelector(selector);
    return node && node.value;
};

const addModelEventListener = node => {
    const root = node.shadowRoot;

    const container = root.querySelector(".modelcontainer");
    const layerSize = container.querySelector(".layersize");
    const resultArea = container.querySelector(".result");
    let layerConfigs = [];

    const funcs = {
        addlayer() {
            const units = parseInt(container.querySelector(".units").value);
            const activation = getSlottedValue({
                selector: ".activation",
                shadowContainer: container
            });
            if (!activation || isNaN(units)) {
                throw new TypeError(`Invalid units or activation: units=${units}, activation=${activation}`);
            }
            const layerConfig = new ml.LayerConfig({
                units, activation
            });
            layerConfigs.push(layerConfig);
            layerSize.innerHTML = layerConfigs.length;
        },
        async predict() {
            const inputShape = parseInt(container.querySelector(".inputshape").value);
            const width = parseInt(container.querySelector(".width").value);
            if ([inputShape, width].some(isNaN)) {
                throw new TypeError(`Found invalid sample data size: ${[inputShape, width]}`);
            }
            const sampleDataType = getSlottedValue({
                selector: ".sampledata",
                shadowContainer: container
            });
            const factory = sampleDataFactory[sampleDataType];
            if (typeof factory !== "function") {
                throw new TypeError(`Invalid sample data type: ${sampleDataType}`);
            }
            const inputData = factory([width, inputShape]);
            const model = new ml.Model({inputShape, layerConfigs});
            const result = model.predict(inputData);
            const data = await result.data();
            resultArea.innerHTML = data.toString();
        },
        reset() {
            layerConfigs = [];
            layerSize.innerHTML = 0;
            resultArea.innerHTML = "&nbsp;";
        }
    };

    container.addEventListener("click", async event => {
        if (event.target.classList.contains("evtarget")) {
            event.stopPropagation();
            Object.keys(funcs)
                .filter(key => event.target.classList.contains(key))
                .forEach(key => funcs[key]());
        }
    });
};

class ModelElement extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({mode: "open"});

        // custom elementの属性名も当然公開インターフェースとなる。
        let initialSampleSize = parseInt(this.getAttribute("initialsamplesize"));
        if (isNaN(initialSampleSize)) {
            initialSampleSize = 1;
        }

        // 活性化関数のリストをユーザーがカスタマイズできるようにしている。
        // slot要素のnameは必然的に公開インターフェースとなる。
        // slot内部の要素のclass等もユーザーが知っている必要がある。
        const html = `
        <div class="modelcontainer">
          <link rel="stylesheet" href="element.css" />
          <div class="inputs">
            <button class="evtarget reset">モデル初期化</button>
            <div>
              <p class="title">入力層</p>
              <label>サイズ<input class="inputshape" type="number" value="5" min="0" /></label>
            </div>
            <div class="hiddenlayer">
              <p class="title">隠れ層</p>
              <label>次元の数<input class="units" type="number" value="2" min="0" /></label>
              <label>
                活性化関数
                <slot name="activation">
                  <select class="activation">
                    <option value="relu" selected>Relu</option>
                    <option value="softmax">Softmax</option>
                  </select>
                </slot>
              </label>
              <div>
                <button class="evtarget addlayer">追加</button>
                <span>追加済みレイヤ数=<strong class="layersize">0</strong>個</span>
              </div>
            </div>
            <div>
              <p class="title">サンプルデータサイズ</p>
              <div class="description">
                <p>列数は入力層のサイズと同じ値になります。</p>
              </div>
              <div>
                <label>
                  データ構成
                  <slot name="sampledatalist">
                    <select class="sampledata">
                      <option value="ones" selected>全要素1</option>
                      <option value="zeros">全要素0</option>
                    </select>
                  </slot>
                </label>
              </div>
              <label>行数<input class="width" type="number" value="${initialSampleSize}" min="1" /></label>
            </div>
          </div>
          <div class="outputs">
            <p class="title">出力層</p>
            <button class="evtarget predict">モデル評価</button>
            <p class="result">&nbsp;</p>
          </div>
        </div>
`;

        shadow.innerHTML = html;

        // <template>から読み込んでcustom elementをDOMに追加するコード
        // ただし以下のコードではDOMへの追加は成功しなかった。
        //const template = document.querySelector("#tensor-model");
        //const templateNode = template.content.cloneNode(true);
        //shadow.appendChild(templateNode);
    }

    connectedCallback() {
        addModelEventListener(this);

        // slotchangeイベント確認用コード
        const slots = this.shadowRoot.querySelectorAll("slot");
        Array.from(slots).forEach(slot => {
            slot.addEventListener("slotchange", event => {
                console.log(event);
                // slotにユーザーが挿入しようとした要素が不適切ならここで失敗させることもできる。
                console.log(slot.assignedNodes());
            });
        });
    }
}

const myElement = {
    FormulaElement,
    ModelElement,
    test: {
        runTest: ml.test.runTest
    }
};

export default myElement;

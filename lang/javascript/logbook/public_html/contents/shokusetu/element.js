/**
 * @fileOverview 触接計算に必要な情報を入力するためのcustom element
 * ライブラリ側コンポーネント層
 */

// SlotElementの削除ボタンをcustom element側で用意する場合、追加ボタンも用意しなければ
// 対応が取れなくなる。(削除があるのに追加がない、といった状態になる)
// しかしながらSlotElementの追加ボタンはSlotElementのコンテナが持つべきである。
// このcustom elementではコンテナではなく艦のスロット1個を表現することに徹したいので、
// 追加ボタン及び削除ボタンは用意しない。
// ただし削除ボタン等を必要に応じてユーザーが追加できるようにslot要素を含めている。
class SlotElement extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({mode: "open"});

        // input要素(number)でmax属性が指定されていない場合は入力欄の幅が自動設定される。
        // この時大抵大きめに設定されてしまう。CSSで調整できるがmaxを指定しておく方が
        // 意図しないスタイル崩れを回避しやすい。
        const content = `
        <link rel="stylesheet" href="element.css" />
        <div class="base">
          <label>索敵<input class="param" name="search" type="number" min="0" max="999" value="0" /></label>
          <label>命中<input class="param" name="hit" type="number" min="0" max="999" value="0" /></label>
          <label>搭載<input class="param" name="carry" type="number" min="0" max="999" value="0" /></label>
          <slot name="option"></slot>
        </div>
`;

        shadow.innerHTML = content;
    }

    // DOMツリー構築後に生成されるcustom elementが属性を持っていると
    // そのcustom elementを生成しようとした時にエラーになる。
    // 属性の初期化処理はコンストラクタではなくconnectedCallbackで行うのが安全である。
    connectedCallback() {
        ["search", "hit", "carry"].forEach(attrName => {
            this.setAttribute(attrName, 0);
        });
        const root = this.shadowRoot;
        const base = root.querySelector(".base");
        base.addEventListener("change", event => {
            if (event.target.classList.contains("param")) {
                //console.log(event.composedPath());
                // 仮にstopPropagationしていなくてもchangeイベントはShadow境界を越えない。
                event.stopPropagation();
                const changedElement = event.target;
                const param = parseInt(changedElement.value);
                this.setAttribute(changedElement.name, param);
                // bubblesとcomposedはread onlyなのでEventオブジェクトを作り直さないと
                // dispatchEventできない。
                //Object.assign(event, {bubbles: true, composed: true});
                //root.dispatchEvent(event);
                root.dispatchEvent(new Event(event.type, {bubbles: true, composed: true}));
            }
        });
    }
}

class AirStateElement extends HTMLElement {
    constructor() {
        super();

        this.setAttribute("airstate", "制空権確保");

        const shadow = this.attachShadow({mode: "open"});

        const html = `
        <link rel="stylesheet" href="element.css" />
        <div class="airstates">
          <label><input class="airstate" type="radio" name="airstate" value="制空権確保" checked>制空権確保</label>
          <label><input class="airstate" type="radio" name="airstate" value="航空優勢">航空優勢</label>
          <label><input class="airstate" type="radio" name="airstate" value="航空劣勢">航空劣勢</label>
        </div>
`;
        
        shadow.innerHTML = html;
    }

    connectedCallback() {
        const root = this.shadowRoot;
        const base = root.querySelector(".airstates");
        base.addEventListener("change", event => {
            if (event.target.classList.contains("airstate")) {
                //console.log(event.composedPath());
                event.stopPropagation();
                this.setAttribute("airstate", event.target.value);
                root.dispatchEvent(new Event(event.type, {bubbles: true, composed: true}));
            }
        });
    }
}

const elt = {
    SlotElement,
    AirStateElement
};

export default elt;
    
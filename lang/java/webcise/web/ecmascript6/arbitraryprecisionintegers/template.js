import bi from "./bigint.js";

class BigIntPractice extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({mode: "open"});
        const template = document.querySelector(".bigint-practice-template");
        shadow.appendChild(template.content.cloneNode(true));
    }

    // TODO: bigint.jsの他のAPIを扱うサンプルを追加する。
    connectedCallback() {
        const root = this.shadowRoot;
        const resArea = root.querySelector(".resultarea");
        const ctrl = root.querySelector(".control");
        ctrl.addEventListener("change", event => {
            if (event.target.classList.contains("target")) {
                event.stopPropagation();
                const val = event.target.value;
                const result = bi.toBigInt(val);
                resArea.innerHTML += `${result} typeof ${typeof result}<br >`;
            }
        });
    }
}

bi.test.runTest();

const module = {
    BigIntPractice
};

export default module;

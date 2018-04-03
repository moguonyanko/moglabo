/**
 * Autonomous custom elements
 */
class AutoList extends HTMLElement {
    constructor() {
        super();

        const mode = "open";
        const shadow = this.attachShadow({mode});

        const listBase = document.createElement("ul");
        const separator = this.getAttribute("separator") || ",";
        const values = this.getAttribute("values") || "";
        const list = Array.from(values.split(separator))
            .map(e => this.toLi(e))
            .reduce((acc, li) => {
                acc.appendChild(li);
                return acc;
            }, document.createDocumentFragment());
        listBase.appendChild(list);

        shadow.appendChild(listBase);
    }

    toLi(value) {
        const li = document.createElement("li");
        li.appendChild(document.createTextNode(value));
        return li;
    }
}

/**
 * Customized built-in elements
 */
class UpperParagraph extends HTMLParagraphElement {
    constructor() {
        super();

        // attachShadowするとp要素自体がDOMから消えてしまう。
        //const mode = "open";
        //const shadow = this.attachShadow({mode});

        this.textContent = this.textContent.toUpperCase();
    }
}

/**
 * Using the lifecycle callbacks
 * 参考:
 * https://github.com/mdn/web-components-examples/blob/master/life-cycle-callbacks/main.js
 */
class Calculator extends HTMLElement {
    // attributeChangedCallbackを動作させるために
    // 属性を返す関数を明示的に定義しておく必要がある。
    static get observedAttributes() {
        return ["lhs", "rhs", "operator"];
    }

    constructor() {
        super();

        const shadow = this.attachShadow({mode: "open"});
        
        const base = document.createElement("div");
        shadow.appendChild(base);
    }
    
    getCalcAttributes() {
        const {lhs, rhs, operator} = {
            lhs: this.getAttribute("lhs"),
            rhs: this.getAttribute("rhs"),
            operator: this.getAttribute("operator")
        };
        
        return {lhs, rhs, operator};
    }
    
    displayResult(result) {
        const shadow = this.shadowRoot;
        shadow.firstChild.innerHTML = result;
    }
    
    execute() {
        const result = calc(this.getCalcAttributes());
        this.displayResult(result);
    }
    
    connectedCallback() {
        console.info("connectedCallback");
        this.execute();
    }
    
    disconnectedCallback() {
        console.info("disconnectedCallback");
    }
    
    adoptedCallback() {
        console.info("adoptedCallback");
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        console.info(`attributeChangedCallback: name=${name}, oldValue=${oldValue}, newValue=${newValue}`);
        this.execute();
    }
}

const operations = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b
};

const calc = ({lhs, rhs, operator}) => {
    if (typeof operations[operator] === "function") {
        return operations[operator](parseInt(lhs), parseInt(rhs));
    } else {
        return NaN;
        //throw new TypeError(`Invalid operator: ${operator}`);
    }
};

const runTest = () => {
    /*
    const listEle = new AutoList();
    console.log(listEle);
    const pEle = new UpperParagraph();
    console.log(pEle);
    */
   // customElements.defineで登録されていないとコンストラクタ呼び出しでエラーになる。
   const calculator = new Calculator();
   calculator.setAttribute("lhs", 10);
   calculator.setAttribute("rhs", 20);
   calculator.setAttribute("operator", "+");
   const {lhs, rhs, operator} = calculator.getCalcAttributes();
   const result = calc({lhs, rhs, operator});
   console.log(result);
};

const myCustomElements = {
    AutoList,
    UpperParagraph,
    Calculator,
    test: {
        runTest
    }
};

export default myCustomElements;
    
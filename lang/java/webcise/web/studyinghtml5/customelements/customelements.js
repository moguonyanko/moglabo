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
    // attributeChangedCallbackを利用しないなら定義する必要は無い。
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

class ProgrammingList extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({mode: "open"});
        const template = document.querySelector(".programming-datalist");
        // cloneNodeでもimportNodeでもcustom elementの追加は可能。
        // それぞれの方法でどういう違いがあるのかは不明である。
        //const clone = template.content.cloneNode(true);
        const clone = document.importNode(template.content, true);
        shadow.appendChild(clone);
    }

    connectedCallback() {
        // LightDOMの要素を得るにはdocument経由。shadowRoot以下には存在しない。
        console.info(document.querySelector("#sampledataid"));
        
        const shadow = this.shadowRoot;
        const memo = this.getAttribute("memo") || "Nothing!";
        shadow.querySelector("#memoview").innerHTML = memo;
    }

    // custom elementが最初にShadowDOMに追加される時には呼び出されない。
    adoptedCallback() {
        console.info(`adoptedCallback: ${new Date().toLocaleString()}`);
    }
}

const getTemplate = name => {
    const iframe = document.querySelector(".custom-templates-frame");
    const frameDoc = iframe.contentWindow.document;
    const template = frameDoc.querySelector(`.${name}`);
    return template;
};

const insertAttribute = ({node, template, attributeName}) => {
    const attr = node.getAttribute(attributeName);
    if (attr) {
        template.content.querySelector(`.${attributeName}`).innerHTML = attr;
    }
};

class MyUserData extends HTMLElement {
    constructor() {
        super();

        const template = getTemplate("my-userdata");
        insertAttribute({
            node: this,
            attributeName: "description",
            template
        });
        const shadow = this.attachShadow({mode: "open"});
        shadow.appendChild(template.content.cloneNode(true));
    }
}

class MyMenuList extends HTMLElement {
    constructor() {
        super();

        const template = getTemplate("my-menulist");
        insertAttribute({
            node: this,
            attributeName: "shopname",
            template
        });
        const shadow = this.attachShadow({mode: "open"});
        shadow.appendChild(template.content.cloneNode(true));
    }
}

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
    ProgrammingList,
    MyUserData,
    MyMenuList,
    test: {
        runTest
    }
};

export default myCustomElements;
    
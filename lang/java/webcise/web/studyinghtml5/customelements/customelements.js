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

class RepeatParagraph extends HTMLParagraphElement {
    constructor() {
        super();
        
        const mode = "open";
        const shadow = this.attachShadow({mode});
        
        const span = document.createElement("span");
        const p = this.parentNode;
        const text = p.innerText || p.textContent;
        span.appendChild(document.createTextNode(text));
        
        shadow.appendChild(span);
    }
}

const runTest = () => {
    const listEle = new AutoList();
    console.log(listEle);
    const pEle = new RepeatParagraph();
    console.log(pEle);
};

const myCustomElements = {
    AutoList,
    RepeatParagraph,
    test: {
        runTest
    }
};

export default myCustomElements;
    
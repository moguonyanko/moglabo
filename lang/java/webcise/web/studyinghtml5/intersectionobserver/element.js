class InfiniteScrolling extends HTMLElement {
    constructor() {
        super();

        this.targetClassName = "content";
        this.contentNumber = 0;

        const shadow = this.attachShadow({mode: "open"});
        const template = document.querySelector(".infinite-scrolling");
        const content = template.content;
        shadow.appendChild(content.cloneNode(true));
    }

    get base() {
        return this.shadowRoot.querySelector(".base");
    }

    get targets() {
        return this.base.querySelectorAll(`.${this.targetClassName}`);
    }

    async createJSON() {
        const res = await fetch(`sample.json?${++this.contentNumber}`);
        const json = await res.json();
        json.code = this.contentNumber;
        const jsonText = JSON.stringify(json);
        const node = document.createTextNode(jsonText);
        const content = document.createElement("p");
        content.setAttribute("class", this.targetClassName);
        content.appendChild(node);
        return content;
    }

    removeJSON() {
        const target = this.base.querySelector(`.${this.targetClassName}:first-of-type`);
        target.parentNode.removeChild(target);
    }

    createContent(text) {
        const node = document.createTextNode(text);
        const content = document.createElement("p");
        content.setAttribute("class", this.targetClassName);
        content.appendChild(node);
        return content;
    }

    // TODO: 1つでも非表示になっている要素があるとnotifyが呼び出され続けてしまう。
    notify(entries, observer) {
        console.log(entries, observer);
        entries.forEach(async entry => {
            if (!entry.isIntersecting) {
                const target = entry.target;
                target.parentNode.removeChild(target);
                const newContent = await this.createJSON();
                this.base.appendChild(newContent);
                observer.observe(newContent);
            }
        });
    }

    createThreshold(stepSize) {
        const gen = function* () {
            let n = 0;
            while (n <= stepSize) {
                yield n / stepSize;
                n++;
            }
        };

        return Array.from(gen());
    }

    // IntersectionObserverコンストラクタの第1引数にthis.notifyのみを指定すると
    // notify内のthisがroot(ここではthis.base)になる。
    connectedCallback() {
        const options = {
            root: this.base,
            threshold: this.createThreshold(10),
            rootMargin: "0%"
        };
        const observer =
            new IntersectionObserver((ens, obv) => this.notify(ens, obv), options);
        Array.from(this.targets).forEach(el => observer.observe(el));
    }
}

const myObserver = {
    InfiniteScrolling
};

export default myObserver;

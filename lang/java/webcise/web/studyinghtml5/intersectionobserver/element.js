class InfiniteScrolling extends HTMLElement {
    constructor() {
        super();

        this.targetClassName = "content";

        const shadow = this.attachShadow({mode: "open"});
        const template = document.querySelector(".infinite-scrolling");
        const content = template.content;
        shadow.appendChild(content.cloneNode(true));
    }

    get base() {
        return this.shadowRoot.querySelector(".base");
    }

    async appendJSON() {
        const res = await fetch("sample.json");
        const json = await res.json();
        const jsonText = JSON.stringify(json);
        const node = document.createTextNode(jsonText);
        const p = this.base.querySelector(`.${this.targetClassName}`);
        p.appendChild(node);
        this.base.appendChild(p);
    }

    removeJSON() {
        const target = this.base.querySelector(`.${this.targetClassName}:first-of-type`);
        target.parentNode.removeChild(target);
    }

    // こういうメソッドはprivateにしたい。
    notify(entries, observer) {
        // TODO: sample.jsonのダウンロードとページへの追加
        console.log(entries);
    }

    connectedCallback() {
        const options = {
            root: this.base,
            rootMargin: "0%",
            threshold: [0.1, 0.9]
        };
        const observer = new IntersectionObserver(this.notify, options);
        const targets = this.base.querySelectorAll(`.${this.targetClassName}`);
        /**
         * TODO: 無限スクロールが行えるようにobserve対象を適切に設定する。
         */
        Array.from(targets).forEach(el => observer.observe(el));
    }
}

const myObserver = {
    InfiniteScrolling
};

export default myObserver;

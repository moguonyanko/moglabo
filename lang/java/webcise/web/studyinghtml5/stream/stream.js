const createReadableStream = async src => {
    const response = await fetch(src);
    const stream = response.body;
    const reader = stream.getReader();
    const readableStream = new ReadableStream({
        async start(controller) {
            while (true) {
                // readで返されるのはジェネレータではなくPromiseである。
                // 少なくともこの書き方では一度に全てのデータを読んでしまうようである。
                const {value, done} = await reader.read();
                if (done) {
                    break;
                }
                controller.enqueue(value);
            };
            controller.close();
            reader.releaseLock();
        }
    });
    return readableStream;
};

class SimpleImageStream extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({mode: "open"});
        const template = document.querySelector(".simple-image-stream-template");
        shadow.appendChild(template.content.cloneNode(true));
    }

    createImage(blob) {
        const img = new Image();
        img.setAttribute("class", "stream-image");
        img.width = this.getAttribute("width");
        img.height = this.getAttribute("height");
        const url = URL.createObjectURL(blob);
        img.onload = () => URL.revokeObjectURL(url);
        img.src = url;
        return img;
    }

    async connectedCallback() {
        const base = this.shadowRoot.querySelector(".base");

        const src = this.getAttribute("src");
        const rs = await createReadableStream(src);
        const blob = await new Response(rs).blob();

        const count = parseInt(this.getAttribute("count"));
        if (!isNaN(count) && count > 0) {
            for (let i = 0; i < count; i++) {
                base.appendChild(this.createImage(blob));
            }
        }
    }
}

const streamLib = {
    element: {
        SimpleImageStream
    }
};

export default streamLib;

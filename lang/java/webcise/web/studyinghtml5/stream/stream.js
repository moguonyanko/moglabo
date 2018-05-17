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
            }
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

let readableNumber = 1;
let readedNumbers = [];

// readableNumberがlimitに達する前に呼び出された場合であってもdoneはtrueになっていない。
// しかしその時CustomNumberStreamのpullが呼び出されてdoReadが中止される。
// なおlimitに達した後呼び出された場合でもdoneがtrueになっていることは無い。
const readStream = async ({stream, limit}) => {
    const reader = stream.getReader();
    while (true) {
        const {done, value} = await reader.read();
        if (done || value > limit) {
            console.log(`Done -> ${done}, value > limit -> ${value > limit}`);
            break;
        }
        readedNumbers.push(value);
    }
    // 呼び出しても呼び出さなくてもエラーにはならない。
    reader.releaseLock();
};

const getAttributes = ({obj, attributeNames = [], parser = v => v}) => {
    const attribtues = attributeNames.reduce((acc, name) => {
        const elementAttr = obj.getAttribute(name);
        const attr = parser(elementAttr);
        if (isNaN(attr)) {
            throw new TypeError(`Invalid attribute: ${elementAttr}`);
        }
        acc[name] = attr;
        return acc;
    }, {});
    return attribtues;
};

/**
 * @description 
 * ReadableStreamDefaultControllerに連番をenqueueしていって、
 * 後でreadしその結果を出力するサンプルcustom element。
 */
class CustomNumberStream extends HTMLElement {
    constructor() {
        super();

        Object.assign(this, getAttributes({
            obj: this,
            attributeNames: [
                "initial",
                "limit",
                "interval"
            ],
            parser: parseInt
        }));

        this.initialNumber = parseInt(this.getAttribute("initial"));
        this.limitNumber = parseInt(this.getAttribute("limit"));
        this.interval = parseInt(this.getAttribute("interval"));

        const shadow = this.attachShadow({mode: "open"});
        const template = document.querySelector(".custom-number-stream-template");
        shadow.appendChild(template.content.cloneNode(true));
    }

    get output() {
        const base = this.shadowRoot.querySelector(".base");
        return base.querySelector(".output");
    }

    connectedCallback() {
        const base = this.shadowRoot.querySelector(".base");
        const output = this.output;
        const limit = this.limitNumber;
        const interval = this.interval;
        let number = this.initialNumber;
        let intervalId;

        const doRead = async ({stream, controller}) => {
            clearInterval(intervalId);
            await readStream({stream, limit});
            output.innerHTML += `Readed numbers: ${readedNumbers} limit ${limit}<br />`;
            // releaseLockをclose内部で呼び出しているのかもしれない。
            controller.close();
        };

        const stream = new ReadableStream({
            start(controller) {
                intervalId = window.setInterval(() => {
                    output.innerHTML = `${number}<br />`;
                    controller.enqueue(number++);
                }, interval);

                base.addEventListener("click", async event => {
                    if (event.target.classList.contains("read")) {
                        event.stopPropagation();
                        await doRead({stream, controller});
                    }
                });
            },
            pull(controller) {
                console.log("Pulled");
                console.log(controller);
            },
            cancel(reason) {
                console.log(`Canceled: ${reason}`);
                clearInterval(intervalId);
            }
        });
    }
}

const streamLib = {
    element: {
        SimpleImageStream,
        CustomNumberStream
    }
};

export default streamLib;

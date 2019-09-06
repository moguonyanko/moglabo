/**
 * @fileoverview Stream API調査用スクリプト
 */

const readViaStream = async ({ resource, contentType }) => {
  const orgResponse = await fetch(resource);
  if (!orgResponse.ok) {
    throw new Error(`Fetch error: ${orgResponse.status}`);
  }

  const reader = orgResponse.body.getReader();
  const stream = new ReadableStream({
    start(controller) {
      (async function () {
        // while (true) {} はESLint的にはBadらしい。
        for (; ;) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            break;
          }
          // ここで少しずつvalueに何らかの処理を行うなどしなければ
          // Streamの利点がないのでは？
          controller.enqueue(value);
        }
      })();
    }
  });

  const option = { headers: { 'Content-Type': contentType } };
  const newResponse = new Response(stream, option);

  return await newResponse.blob();
};

// TODO: 少しずつ読み込むようにしたかったが上手くいっていない。
// eslint-disable-next-line no-unused-vars
const writeStreamFromFile = ({ writeStream, file }) => {
  const writer = writeStream.getWriter();
  const fileReader = new FileReader();
  fileReader.onprogress = () => writer.write(fileReader.result);
  const step = 4;
  for (let start = 0, end = step; start < file.size;
    start += step, end = start + step) {
    fileReader.readAsBinaryString(file.slice(start, end));
  }
  writer.close();
};

const writeViaStream = ({ file, width, height }) => {
  const canvas = new OffscreenCanvas(width, height),
    ctx = canvas.getContext('2d');

  return new Promise((resolve, reject) => {
    const writeStream = new WritableStream({
      write(chunk) {
        return new Promise(async (resolve, reject) => {
          try {
            const bitmap = await createImageBitmap(chunk);
            ctx.drawImage(bitmap, 0, 0, width, height);
            resolve(chunk);
          } catch (err) {
            reject(err);
          }
        });
      },
      close() {
        resolve(canvas.convertToBlob());
      },
      abort(err) {
        reject(err);
      }
    }, new CountQueuingStrategy({ highWaterMark: 1 }));

    const writer = writeStream.getWriter();
    // 一度にファイル全部をwriteしてしまうのではStreamの意味が無い。
    writer.write(file);
    writer.close();
  });
};

// DOM

class ReadableStreamExample extends HTMLElement {
  constructor() {
    super();
    const t = document.getElementById('readable-stream-example');
    const content = t.cloneNode(true).content;
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(content);
  }

  // private fieldにエディタやESLintが対応していないため
  // メソッドで定義している。
  async loadImage() {
    const canvas = this.shadowRoot.querySelector('canvas');
    const resource = '/webxam/service/loadTestImage',
      contentType = 'image/png';
    const blob = await readViaStream({ resource, contentType });
    const bitmap = await createImageBitmap(blob);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  }

  connectedCallback() {
    this.shadowRoot.addEventListener('pointerup', async event => {
      const target = event.target.dataset.eventTarget;
      // private fieldに関数を設定している場合にthis#[target]やthis.#[target]と
      // 書くとシンタックスエラーとなる。
      const func = this[target];
      if (typeof func !== 'function') {
        return;
      }
      event.stopPropagation();
      await func.bind(this)();
    });
  }
}

class WritableStreamExample extends HTMLElement {
  constructor() {
    super();
    const t = document.getElementById('writable-stream-example');
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(t.cloneNode(true).content);
  }

  connectedCallback() {
    const root = this.shadowRoot;
    root.addEventListener('change', async event => {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      const canvas = root.querySelector('canvas'),
        ctx = canvas.getContext('2d');
      const { width, height } = canvas;

      const blob = await writeViaStream({ file, width, height });
      const bitmap = await createImageBitmap(blob);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  customElements.define('readable-stream', ReadableStreamExample);
  customElements.define('writable-stream', WritableStreamExample);
});

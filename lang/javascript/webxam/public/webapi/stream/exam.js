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
      const process = async () => {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          return null;
        }
        controller.enqueue(value);
        return process();
      };
      return process();
    }
  });

  const option = { headers: { 'Content-Type': contentType } };
  const newResponse = new Response(stream, option);

  return await newResponse.blob();
};

// DOM

class ReadableStreamExample extends HTMLElement {
  constructor() {
    super();
    const t = document.getElementById('readable-stream-examle');
    const content = t.cloneNode(true).content;
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(content);
  }

  #loadImage = async () => {
    const canvas = this.shadowRoot.querySelector('canvas');
    const resource = '/webxam/service/loadTestImage',
      contentType = 'image/png';
    const blob = await readViaStream({ resource, contentType });
    const bitmap = await createImageBitmap(blob);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  };

  #listeners = {
    loadImage: this.#loadImage.bind(this)
  };

  connectedCallback() {
    this.shadowRoot.addEventListener('pointerup', async event => {
      const target = event.target.dataset.eventTarget;
      // private fieldに関数を設定している場合にthis#[target]やthis.#[target]と
      // 書くとシンタックスエラーとなる。
      const func = this.#listeners[target];
      if (typeof func !== 'function') {
        return;
      }
      event.stopPropagation();
      await func();
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  customElements.define('readable-stream', ReadableStreamExample);
});

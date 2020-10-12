/**
 * @fileoverview WebGLの準備方法を学ぶためのサンプル
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL
 */

class WebGLCanvasElement extends HTMLCanvasElement {
  constructor() {
    super();
  }

  static get observedAttributes() { 
    return ['r', 'g', 'b', 'a']; 
  }

  #clear({ r = 0.0, g = 0.0, b = 0.0, a = 1.0 } = {}) {
    const context = this.getContext('webgl');
    context.clearColor(r, g, b, a);
    // clearも呼び出さないと設定した色でクリアされない。
    context.clear(context.COLOR_BUFFER_BIT);
  }

  #getRGBA() {
    return {
      r: this.getAttribute('r'),
      g: this.getAttribute('g'),
      b: this.getAttribute('b'),
      a: this.getAttribute('a')
    };
  }

  connectedCallback() {
    this.#clear(this.#getRGBA());
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const rgba = this.#getRGBA();
    rgba[name] = newValue;
    this.#clear(rgba);
  }
}

customElements.define('webgl-canvas', WebGLCanvasElement, { extends: 'canvas' });

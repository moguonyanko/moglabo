/**
 * @fileoverview 要素の中央揃えサンプル動作用スクリプト
 */

class CenteringElement extends HTMLElement {
  constructor() {
    super();
    const { content } = document.querySelector('template.centering');
    const node = content.cloneNode(true);
    this.attachShadow({ mode: 'open' }).appendChild(node);
  }
}

const main = () => {
  customElements.define('centering-element', CenteringElement);
};

main();

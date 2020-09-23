/**
 * @fileoverview Performance関連API調査用スクリプト
 */

const Performances = {
  measureMemory: async () => {
    if (!self.crossOriginIsolated) {
      throw Error('Cannot use Performance API');
    }
    const result = await performance.measureMemory();
    return result;
  }
}; 

class MeasureMemoryElement extends HTMLButtonElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener('click', async () => {
      const query = this.getAttribute('performance-result');
      const output = document.querySelector(query);
      if (!output) {
        return;
      }
      const result = await Performances.measureMemory();
      output.innerHTML = JSON.stringify(result);
    });
  }
}

const defineElements = () => {
  customElements.define('memory-measure',
    MeasureMemoryElement,
    { extends: "button" });
};

const init = () => {
  defineElements();
};

init();

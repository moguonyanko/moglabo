/**
 * @fileoverview Performance関連API調査用スクリプト
 */

const Performances = {
  measureMemory: async () => {
    // COEP関連のレスポンスヘッダを設定していなければcrossOriginIsolatedはfalseになる。
    // 参考: https://web.dev/coop-coep/
    if (!self.crossOriginIsolated) {
      throw Error('Cannot use Performance API');
    }
    const result = await performance.measureMemory();
    return result;
  },
  profile: async ({ sampleInterval = 10, task }) => {
    if (typeof task !== 'function') {
      throw new Error(`${task} is not function`);
    }
    // sampleIntervalが大きいほどtimestampの量が少なくなる。
    const profiler = await performance.profile({ sampleInterval });
    await task();
    const result = await profiler.stop();
    return result;
  }
};

class CustomButtonElement extends HTMLButtonElement {
  constructor() {
    super();
  }

  get output() {
    const query = this.getAttribute('performance-result');
    const output = document.querySelector(query);
    if (!output) {
      throw new Error('Not found output element');
    }
    return output;
  }
}

class MeasureMemoryElement extends CustomButtonElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener('click', async () => {
      const result = await Performances.measureMemory();
      super.output.innerHTML = JSON.stringify(result);
    });
  }
}

class ProfileTaskElement extends CustomButtonElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener('click', async () => {
      const sampleHeavyTask = Performances.measureMemory;
      const result = await Performances.profile({
        task: sampleHeavyTask,
        sampleInterval: 100
      });
      super.output.innerHTML = JSON.stringify(result);
    });
  }
}

const defineElements = () => {
  customElements.define('memory-measure',
    MeasureMemoryElement,
    { extends: "button" });
  customElements.define('profile-task',
    ProfileTaskElement,
    { extends: "button" });
};

const init = () => {
  defineElements();
};

init();

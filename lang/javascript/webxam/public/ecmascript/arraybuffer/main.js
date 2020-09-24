/**
 * @fileoverview ArrayBuffer調査用スクリプト
 */

const sendBuffer = ({ worker, buffer }) => {
  const promise = new Promise((resolve, reject) => {
    worker.onmessage = event => {
      resolve(event.data);
    };
    worker.onerror = reject;
    worker.postMessage(buffer);
  });
  return promise;
};

const getEchoSharedArrayBuffer = async (size = 1024) => {
  const worker = new Worker('echo.js');
  const buffer = new SharedArrayBuffer(size);
  const result = await sendBuffer({
    worker, buffer
  });
  return result;
};

const runTest = async () => {
  if (!self.crossOriginIsolated) {
    throw new Error('SharedArrayBuffer is disabled');
  }
  const result = await getEchoSharedArrayBuffer();
  console.log(result);
};

// DOM

class EchoSharedArrayBuffer extends HTMLButtonElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener('click', async () => {
      const output = document.querySelector(this.dataset.resultOutput);
      const result = await getEchoSharedArrayBuffer();
      output.innerHTML = `${JSON.stringify(result)}<br />`;
      output.innerHTML += `byteLength = ${result.byteLength}`;
    });
  }
}

const defineElements = () => {
  customElements.define('echo-shared-array-buffer',
    EchoSharedArrayBuffer, { extends: 'button' });
};

const init = async () => {
  await runTest();
  defineElements();
};

init().then();

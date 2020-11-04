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

const getRandomIntegerFromWorkers = ({ timeout = 100 } = {}) => {
  return new Promise((resolve, reject) => {
    const writer = new Worker('writer.js', {
      type: 'module'
    });
    const reader = new Worker('reader.js');
    const array = new SharedArrayBuffer(1024);
    const tarray = new Int32Array(array);
    // ここでTypedArrayに変更を加えるとWorkerのwaitが間に合わなくなる。
    //Atomics.add(tarray, 0, 100);
    //tarray[0] = 100;
    reader.postMessage(tarray);
    reader.addEventListener('message', event => resolve(event.data));
    reader.addEventListener('error', reject);
    // timeoutが小さいとwaitより先にnotifyが呼び出されてしまう。
    setTimeout(() => writer.postMessage(tarray), timeout);
    writer.addEventListener('error', reject);
  });
};

const runTest = async () => {
  if (!self.crossOriginIsolated) {
    throw new Error('SharedArrayBuffer is disabled');
  }
  console.log(await getEchoSharedArrayBuffer());
  console.log(await getRandomIntegerFromWorkers());
};

// DOM

// CustomElementsで表現するとカスタムデータ属性を使わないでイベント処理が行えるが
// イベントハンドラが多くなる。たとえばmainから伝搬してきたイベントをカスタムデータ属性の値に
// 基づいてハンドラを取得し実行するといったことができない。

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

class RandomNumberButton extends HTMLButtonElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener('click', async () => {
      const output = document.querySelector('.wait-and-notify .output');
      const result = await getRandomIntegerFromWorkers();
      output.innerHTML = result;
    });
  }
}

const defineElements = () => {
  customElements.define('echo-shared-array-buffer',
    EchoSharedArrayBuffer, { extends: 'button' });
  customElements.define('wait-and-notify-number',
    RandomNumberButton, { extends: 'button' });
};

const init = async () => {
  await runTest();
  defineElements();
};

init().then();

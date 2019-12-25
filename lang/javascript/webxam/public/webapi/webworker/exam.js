/**
 * @fileoverview Web Worker API調査用スクリプト
 */

const dispatch = (event, listener) => {
  const et = event.target.dataset.eventTarget;
  if (typeof listener[et] !== 'function') {
    return;
  }
  event.stopPropagation();
  listener[et]();
};

class Listener {
  #worker;
  #intervalId;
  #output;
  #workerPath;
  #workerType;

  constructor({ base, workerPath, workerType = 'classic' }) {
    this.#output = base.querySelector('.output');
    this.#workerPath = workerPath;
    this.#workerType = workerType;
  }

  run() {
    this.#output.innerHTML = '';
    this.#worker = new Worker(this.#workerPath, { 
      type: this.#workerType
     });
    this.#worker.addEventListener('message', e => {
      this.#output.innerHTML += `${e.data}<br />`;
    });
    clearInterval(this.#intervalId);
    this.#intervalId = setInterval(() => {
      this.#worker?.postMessage(Date.now());
    }, 1000);
  }

  terminate() {
    this.#worker?.terminate();
    this.#worker = null;
    clearInterval(this.#intervalId);
  }
}

const simpleWorker = () => {
  const base = document.querySelector('.simpleWorker');
  const listener = new Listener({ base, workerPath: 'simpleworker.js' });
  base.addEventListener('pointerup', e => dispatch(e, listener));
};

const chainWorker = () => {
  const base = document.querySelector('.chainWorker');
  const listener = new Listener({ base, 
    workerPath: 'chainworker.js',
    workerType: 'module'
  });
  base.addEventListener('pointerup', e => dispatch(e, listener));
};

const sample = {
  simpleWorker,
  chainWorker
};

Object.values(sample).forEach(init => init());

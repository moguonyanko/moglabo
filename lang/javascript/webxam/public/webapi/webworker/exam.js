/**
 * @fileoverview Web Worker API調査用スクリプト
 */

const simpleWorker = () => {
  const base = document.querySelector('.simpleWorker'),
    output = base.querySelector('.output');
  let worker, intervalId;

  const listener = {
    run() {
      output.innerHTML = '';
      worker = new Worker('simpleworker.js');
      worker.addEventListener('message', e => {
        output.innerHTML += `${e.data}<br />`;
      });
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        worker?.postMessage(Date.now());
      }, 1000);
    },
    terminate() {
      worker?.terminate();
      worker = null;
      clearInterval(intervalId);
    }
  };

  base.addEventListener('pointerup', event => {
    const et = event.target.dataset.eventTarget;
    if (typeof listener[et] !== 'function') {
      return;
    }
    event.stopPropagation();
    listener[et]();
  });
};

const sample = {
  simpleWorker
};

Object.values(sample).forEach(init => init());

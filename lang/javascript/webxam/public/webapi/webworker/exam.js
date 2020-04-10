/**
 * @fileoverview Web Worker API調査用スクリプト
 */

import { MyMath } from './math.js'; 

const dispatch = (event, listener) => {
  const et = event.target.dataset.eventTarget;
  if (typeof listener[et] !== 'function') {
    return;
  }
  event.stopPropagation();
  listener[et]();
};

/**
 * private fieldはSafariが未対応のため使用していない。
 */
class Listener {
  constructor({ base, workerPath, workerType = 'classic' }) {
    this.output = base.querySelector('.output');
    this.workerPath = workerPath;
    this.workerType = workerType;
  }

  run() {
    this.output.innerHTML = '';
    this.worker = new Worker(this.workerPath, { 
      type: this.workerType
     });
    this.worker.addEventListener('message', e => {
      this.output.innerHTML += `${e.data}<br />`;
    });
    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      this.worker?.postMessage(Date.now());
    }, 1000);
  }

  terminate() {
    this.worker?.terminate();
    this.worker = null;
    clearInterval(this.intervalId);
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

const shareModuleWorker = () => {
  const container = document.querySelector('.shareModuleWorker'),
    output = container.querySelector('.output');

  let currentWorker, taskId;

  const loadWorker = () => {
    const worker = new Worker('./sharemoduleworker.js', {
      type: 'module'
    });
    worker.addEventListener('message', event => {
      // 先に要素のtextContent経由でテキストが挿入されている場合
      // <br />などをinnerHTML経由で挿入しても無視されてしまう。
      output.innerHTML += `${event.data}<br />`;
    });
    return worker;
  };

  const calcTask = () => {
    const a = parseInt(Math.random() * 10),
      b = parseInt(Math.random() * 10);

    const base = MyMath.add(a, b),
      pow = parseInt(container.querySelector('#powInput').value);
    output.innerHTML += `(${a} + ${b})^${pow} = `;
    currentWorker.postMessage({ base, pow });
  };

  container.addEventListener('pointerup', event => {
    const target = event.target.dataset.eventTarget;
    if (target === 'run') {
      output.innerHTML = '';
      if (!currentWorker) {
        currentWorker = loadWorker();
        taskId = setInterval(calcTask, 1000);
      }
    } else if (target === 'terminate') {
      clearInterval(taskId);
      currentWorker = null;
    }
  });
};

const corsWorker = () => {
  const base = document.querySelector(".corsWorker"),
    output = base.querySelector('.output');
  let worker;
  base.addEventListener('click', event => {
      if (event.target.dataset.eventTarget === 'crossOriginRequest') {
        event.stopPropagation();
        if(!worker)worker = new Worker('corsworker.js', { type: 'module' });
        worker.onmessage = ({ data }) => {
            output.innerText = JSON.stringify(data);
        };
        // 引数なしで呼び出すとエラー
        worker.postMessage([]);
      }
  });
};

const sample = {
  simpleWorker,
  chainWorker,
  shareModuleWorker,
  corsWorker
};

Object.values(sample).forEach(init => init());

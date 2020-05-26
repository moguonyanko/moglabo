/**
 * @fileoverview Idle Detection API調査用スクリプト
 */

class IdleManager {
  constructor({ func }) {
    this.controller = new AbortController();
    this.detector = new IdleDetector();
    const f = () => {
      const { userState, screenState } = this.detector;
      func({ userState, screenState });
    };
    this.addListener({ func: f });
  }

  addListener({ func }) {
    this.detector.addEventListener('change', func);
  }

  start({ threshold = 60000 } = {}) {
    // 一分間よりも短い値を閾値に指定するとエラーとなる。
    this.detector.start({ threshold, signal: this.controller.signal });
  }

  abort() {
    this.controller.abort();
    console.log('Detector is aborted');
  }
}

// eslint-disable-next-line no-unused-vars
const runTest = () => {
  const idle = new IdleManager({
    func: ({ userState, screenState }) => console.log(userState, screenState)
  });
  idle.start();
  setTimeout(() => idle.abort(), 3000);
};

// SafariはPermissions APIに未対応
const permit = async ({ name }) => {
  const hasPermission = await navigator.permissions.query({
    name
  });
  return hasPermission.state === 'granted';
};

// DOM

let manager;

const listener = {
  start: () => {
    manager = new IdleManager({
      func: ({ userState, screenState }) => {
        const output = document.querySelector('.output');
        output.value += `Current state: UserState=${userState}, StateScreen=${screenState}\n`;
      }
    });
    const threshold = parseInt(document.querySelector('#threshold').value);
    manager.start({ threshold });
  },
  abort: () => {
    manager?.abort();
    const output = document.querySelector('.output');
    output.value = '';
  }
};

const addListener = () => {
  const main = document.querySelector('main');
  main.addEventListener('click', event => {
    const { eventTarget } = event.target.dataset;
    if (typeof listener[eventTarget] !== 'function') {
      return;
    }
    event.stopPropagation();
    listener[eventTarget]();
  });
};

(async () => {
  //runTest();

  const enableIdleDetector = await permit({ name: 'notifications' });
  console.log(`IdleDetector enable:${enableIdleDetector}`);

  addListener();
})().then();

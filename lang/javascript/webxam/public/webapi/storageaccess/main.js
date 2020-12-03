/**
 * @fileoverview Storage Access API調査用スクリプト
 */

const getCookie = async () => {
    await document.requestStorageAccess();
    return document.cookie;
};

const enableStorageAccess = async () => await document.hasStorageAccess();

const dumpCookie = async () => {
  if (await enableStorageAccess()) {
    console.log(await getCookie());
  } else {
    throw new Error('Storage Access API利用不可');
  }
};

// eslint-disable-next-line no-unused-vars
const runTest = async () => {
  try {
    await dumpCookie();
  } catch (e) {
    console.error(e);
  }
};

const setThirdPartyCookie = async () => {
  if (!(await enableStorageAccess())) {
    throw new Error('Cannot use Storage Access API');
  }
  await document.requestStorageAccess();
  const values = [
    'thirdpartycookie=12345',
    'path=/',
    `domain=${location.host}`,
    'secure',
    // SameSite=Noneでなければ別オリジンのリクエスト時に送信されない。
    // Safariの場合Prevent cross-site tracking設定が有効だと
    // SameSite=Noneでも送信されない。
    'samesite=none' 
  ];
  document.cookie = values.join('; ');
};

// DOM

let storage = window.localStorage;

const listener = {
  getCookie: async () => {
    const output = document.querySelector('.output');
    if (await enableStorageAccess()) {
      try {
        const cookie = await getCookie();
        output.value = cookie;
      } catch (err) {
        output.value = err.message;
      }
    } else {
      output.value = 'No Cookie';
    }
  },
  setThirdPartyCookie,
  // サードパーティCookieがブロックされる場合はストレージへのアクセスが
  // ブロックされるようになる可能性がある。
  incCount: () => {
    const count = parseInt(storage.getItem('count')) || 0;
    storage.setItem('count', count + 1);
  },
  viewCount: () => {
    try {
      alert(storage.getItem('count'));
    } catch (err) {
      alert(err.message);
    }
  },
  changeStorage: event => {
    const { value } = event.target;
    if (value === 'local') {
      storage = window.localStorage;
    } else {
      storage = window.sessionStorage; 
    }
  }
};

const addListener = () => {
  const main = document.querySelector('main');
  main.addEventListener('click', async event => {
    const { eventTarget } = event.target.dataset;
    if (typeof listener[eventTarget] !== 'function') {
      return;
    }
    event.stopPropagation();
    await listener[eventTarget](event);
  });
};

const init = async () => {
  //await runTest();
  addListener();
};

init().then();

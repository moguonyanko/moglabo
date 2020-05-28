/**
 * @fileoverview Storage Access API調査用スクリプト
 */

const getCookie = async () => {
    // FirefoxはrequestStorageAccessを呼び出した時点でエラーとなる。
    await document.requestStorageAccess();
    const cookie = document.cookie;
    return cookie;
};

const enableStorageAccess = async () => await document.hasStorageAccess();

const dumpCookie = async () => {
  if (await enableStorageAccess()) {
    console.log(await getCookie());
  } else {
    throw new Error('Storage Access API利用不可');
  }
};

const runTest = async () => {
  try {
    await dumpCookie();
  } catch (e) {
    console.error(e);
  }
};

// DOM

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
    await listener[eventTarget]();
  });
};

const init = async () => {
  //await runTest();
  //document.cookie = 'samplecookie=test';
  addListener();
};

init().then();

/**
 * @fileOverview Feature Policy調査用スクリプト
 */

const syncLoad = () => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.onreadystatechange = ()  => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status < 400) {
          const json = JSON.parse(xhr.responseText);
          resolve(json);
        } else {
          reject(new Error(xhr.statusText));
        }
      }
    };
    xhr.onerror = reject;
    // Feature Policyに違反させるため同期リクエストを行う。
    // Feature-Policyヘッダで禁止されている場合リクエストを送信する前にエラーとなる。
    const isAsync = false;
    xhr.open('GET', 'sample.json', isAsync);
    xhr.send(null);
  });
};

// DOM

const listeners = {
  async syncxhr() {
    const result = document.querySelector('.result.syncxhr');
    try {
      const json = await syncLoad();
      result.innerHTML = JSON.stringify(json);
    } catch(err) {
      result.innerHTML = err.message;
    }
  }
};

const addListener  = () => {
  const main = document.querySelector('main');
  main.addEventListener('pointerup', async event => {
    const target = event.target.dataset.eventTarget;
    if (target) {
      event.stopPropagation();
      await listeners[target]();
    }
  });
};

const dumpSupportedFeatures = () => {
  const fp = document.featurePolicy;
  if (fp) {
    const result = document.querySelector('.result.features');
    result.innerHTML = fp.features().join('<br />');
  }
};

const init = () => {
  addListener();
  dumpSupportedFeatures();
};

window.addEventListener('DOMContentLoaded', init);

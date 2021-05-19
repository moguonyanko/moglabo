/**
 * @fileoverview Node.jsを用いたブラウザキャッシュ調査用スクリプト
 */

const listener = {
  getCurrentTime: async () => {
    const url = 'https://myhost/webxam/apps/practicenode/currenttime';
    const response = await fetch(url, {
      mode: 'cors',
      // このリクエストにCookieは利用されないのでomitを指定する。(クレデンシャルを含まない)
      credentials: 'omit' 
    });
    if (!response.ok) {
      throw new Error(`Error:${response.status}`);
    }
    const json = await response.json();
    const output = document.querySelector('.getCurrentTime.output');
    output.textContent = json.result;
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
  })
};

addListener();

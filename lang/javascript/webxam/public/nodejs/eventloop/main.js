/**
 * @fileoverview Event Loop調査用スクリプト(Client)
 */

const funcs = {
  async redos () {
    const samplePath = new Array(100).fill('/');
    // 末尾の改行が原因でNodeのEventLoopがブロックされてしまう。
    samplePath.push('/../node\n');
    // 以下のようなパスであればブロックされないがそもそもクライアントから
    // パスを受け取るようなコードは避けるべきである。
    //const samplePath = '/usr/local/bin/node';
    const url = [
      '/webxam/apps/practicenode/eventloop/redos?',
      `path=${encodeURIComponent(samplePath.join(''))}`
    ].join('');
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Redos example error: ${response.status}`);
    }
    return await response.json();
  }
};

// DOM

const addListener = () => {
  const main = document.querySelector('main');
  main.addEventListener('pointerup', async event => {
    const f = funcs[event.target.dataset.eventTarget];
    if (typeof f !== 'function') {
      return;
    }
    const result = await f();
    const output = event.target.parentNode.querySelector('.output');
    output.textContent = JSON.stringify(result);
  });
};  

window.addEventListener('DOMContentLoaded', () => {
  addListener();
});

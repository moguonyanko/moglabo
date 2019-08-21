/**
 * @fileoverview Event Loop調査用スクリプト(Client)
 */

const defaultTimeout = 5000; // ms

/**
 * 指定した時間(ms)でタイムアウトするようにfetchするための関数である。
 * FetchAPIにタイムアウトは存在しない。
 * 参考:
 * https://stackoverflow.com/questions/46946380/fetch-api-request-timeout
 */
const fetchWithTimeout = ({ url, timeout = defaultTimeout }) => {
  return new Promise((resolve, reject) => {
    const aborter = new AbortController();
    const id = setTimeout(() => {
      aborter.abort();
      clearTimeout(id);
      reject(new Error('Timeout!'));
    }, timeout);
    fetch(url, aborter).then(resolve, reject);
  });
};

const funcs = {
  async redos({ withNewLine = false }) {
    const samplePath = new Array(100).fill('/');
    samplePath.push('/../node');
    // 末尾の改行が原因でNodeのEventLoopがブロックされてしまう。
    // (そもそもクライアントからパスを受け取るようなコードは避けるべきである。)
    if (withNewLine) {
      samplePath.push('\n');
    }
    const url = [
      '/webxam/apps/practicenode/eventloop/redos?',
      `path=${encodeURIComponent(samplePath.join(''))}`
    ].join('');
    const response = await fetchWithTimeout({ url });
    if (!response.ok) {
      throw new Error(`Redos example error: ${response.status}`);
    }
    return await response.json();
  }
};

// DOM

const getArgs = {
  redos () {
    return {
      withNewLine: document.getElementById('withnewline').checked
    };
  }
};

const addListener = () => {
  const main = document.querySelector('main');
  main.addEventListener('pointerup', async event => {
    const key = event.target.dataset.eventTarget;
    const f = funcs[key];
    if (typeof f !== 'function') {
      return;
    }
    const output = event.target.parentNode.querySelector('.output');
    try {
      const result = await f(getArgs[key](event.currentTarget));
      output.textContent = JSON.stringify(result);
    } catch (err) {
      output.textContent = err.message;
    }
  });
};

window.addEventListener('DOMContentLoaded', () => {
  addListener();
});

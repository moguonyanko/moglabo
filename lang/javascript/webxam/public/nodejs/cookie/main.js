/**
 * @fileoverview Cookie調査用スクリプト
 */

const reuqestJson = async url => {
  const res = await fetch(url, {
    credentials: 'include',
    mode: 'cors'
  });
  if (!res.ok) {
    throw new Error(`JSON Request Error: ${res.status}`);
  }
  return await res.json();
};

const display = ({ json, selector }) => {
  const resultArea = document.querySelector(selector);
  resultArea.value += `${JSON.stringify(json)}\n`;
};

const listeners = {
  async echoCookie() {
    const url = '/webxam/apps/practicenode/cookie/echo';
    const json = await reuqestJson(url);
    display({ json, selector: '.getCookie .resultarea' });
  },
  async getSampleUser() {
    const url = 'https://myhost/webxam/apps/practicenode/cookie/sampleuser';
    const json = await reuqestJson(url);
    display({ json, selector: '.getCookie .resultarea' });
  }
};

const init = async () => {
  document.querySelector('main').addEventListener('click', async event => {
    if (typeof listeners[event.target.id] === 'function') {
      event.stopPropagation();
      await listeners[event.target.id]();
    }
  });
};

init();

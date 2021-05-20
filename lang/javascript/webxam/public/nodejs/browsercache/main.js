/**
 * @fileoverview Node.jsを用いたブラウザキャッシュ調査用スクリプト
 */

const request = async (url) => {
  const response = await fetch(url, {
    mode: 'cors',
    // このリクエストにCookieは利用されないのでomitを指定する。(クレデンシャルを含まない)
    credentials: 'omit' 
  });
  if (!response.ok) {
    throw new Error(`Error:${response.status}`);
  }
  return response;
};

const origin = 'https://localhost';

const listener = {
  getCurrentTime: async () => {
    const url = `${origin}/webxam/apps/practicenode/currenttime`;
    const response = await request(url);
    const json = await response.json();
    const output = document.querySelector(`div[data-event-output='getCurrentTime']`);
    output.textContent = json.result;
  },
  getSampleImage: async () => {
    const url = `${origin}/webxam/apps/practicenode/sampleimage`;
    const img = new Image(300, 300);
    img.onload = () => {
      const output = document.querySelector(`div[data-event-output='getSampleImage']`);
      output.innerHTML = '';
      output.appendChild(img);
    };
    img.src = url;
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

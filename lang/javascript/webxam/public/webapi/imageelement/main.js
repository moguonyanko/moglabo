/**
 * @fileoverview HTMLImageElement調査用スクリプト
 */

const decodeImage = async src => {
  const img = new Image();
  img.src = src;
  await img.decode();
  return img;
};

const listeners = {
  decodeSample: async () => {
    const output = document.querySelector(`.output[data-event-result='decodeSample']`);
    output.innerHTML = '';
    const src = '../../image/hello.png';
    const img = await decodeImage(src);
    output.appendChild(img);
  }
};

const getListener = event => {
  const { eventTarget } = event.target.dataset;
  return listeners[eventTarget] || (() => {});
};

const init = () => {
  const main = document.querySelector('main');
  main.addEventListener('click', async event => {
    const listener = getListener(event);
    await listener();
  });
};

init();

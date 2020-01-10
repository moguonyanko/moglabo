/**
 * @fileoverview clamp()関数調査用スクリプト
 */

const funcs = {
  changeContainerSize({ target }) {
    const container = document.querySelector(`.container.dynamic`);
    container.style.width = `clamp(200px, ${target.value}px, 500px)`;
  }
};

const addListener = () => {
  const main = document.querySelector('main');
  main.addEventListener('change', event => {
    const { eventTarget } = event.target.dataset;
    if (eventTarget) {
      event.stopPropagation();
      funcs[eventTarget](event);
    }
  });
};

addListener();

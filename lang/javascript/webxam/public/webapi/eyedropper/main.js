/**
 * @fileoverview EyeDropper API調査用スクリプト
 */

/* eslint-disable no-undef */

const startPickColor = () => {
  return new Promise((resolve, reject) => {
    const eyeDropper = new EyeDropper();
    eyeDropper.open()
      .then(result => resolve(result.sRGBHex))
      .catch(reject);
  });
};

const funcs = {
  openEyeDropper: async () => {
    const output = document.querySelector(`.output[data-event-output=openEyeDropper]`);
    try {
      const color = await startPickColor();
      output.textContent = color;
      output.style.backgroundColor = color;
    } catch (err) {
      output.textContent = err.message;
    }
  }
};

const events = {
  click: () => {
    const main = document.querySelector('main');
    main.addEventListener('click', async event => {
      const { eventTarget } = event.target.dataset;
      if (typeof funcs[eventTarget] === 'function') {
        event.stopPropagation();
        await funcs[eventTarget]();
      }
    });
  }
};

const init = () => {
  Object.values(events).forEach(f => f());
};

init();

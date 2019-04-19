/**
 * Promise調査用スクリプト
 */

const doService = async url => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request Error!: ${response.status}`);
  }
  const json = await response.json();
  return json;
};

// DOM

const funcs = {
  async resolvePromise(root) {
    const value = root.querySelector('.resolve-value').value;
    const json = await doService('/webxam/service/hello');
    const ps = [
      Promise.resolve(value),
      Promise.resolve(json.value),
      Promise.resolve(value)
    ];
    const results = await Promise.all(ps);
    const output = root.querySelector('.output');
    output.innerHTML += results.join('<br />');
  }
};

const addListener = () => {
  Array.from(document.querySelectorAll('section.example')).forEach(root => {
    root.addEventListener('pointerup', async event => {
      const et = event.target.dataset.eventTarget;
      if (et) {
        event.stopPropagation();
        if (typeof funcs[et] === 'function') {
          await funcs[et](root);
        }
      }
    });
  });
};

window.addEventListener('DOMContentLoaded', () => {
  addListener();
});

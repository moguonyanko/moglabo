/**
 * @fileoverview importmap調査用スクリプト
 */

// importmapのキーをfrom以下に指定してモジュールをインポートできる。
import SampleMath from "samplemath";

const getArgs = () => {
  const argEles = document.querySelectorAll('input[data-event-args]');
  return Array.from(argEles).map(ele => {
    return { [ele.dataset.eventArgs]: parseInt(ele.value) }
  }).reduce((acc, current) => {
    return Object.assign(acc, current);
  }, {});
};

const listener = {
  calc: () => {
    const method = document.querySelector('select[data-event-type]').value;
    const result = SampleMath[method](getArgs());
    const output = document.querySelector('.output');
    output.textContent = result;
  }
};

const main = () => {
  document.querySelector('main').addEventListener('click', event => {
    const { eventTarget } = event.target.dataset;
    if (typeof listener[eventTarget] === 'function') {
      event.stopPropagation();
      listener[eventTarget]();
    }
  });
};

main();

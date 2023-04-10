/**
 * @fileoverview importmap調査用スクリプト
 */

// importmapのキーをfrom以下に指定してモジュールをインポートできる。
// importmapを使うことで絶対URL以外をfrom以下に指定できる。
import SampleMath from "samplemath";
import { Point, calcDistance } from "sub/samplegeom.js";

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
    const output = document.querySelector('.example.importmap .output');
    output.textContent = result;
  },
  calcDistance: () => {
    const result = calcDistance({
      p1: new Point({x: 5, y: 3}),
      p2: new Point({x: 14, y: 10})
    });
    const output = document.querySelector('.example.loadsubmodule .output');
    output.textContent = result;
  }
};

const main = () => {
  if (!HTMLScriptElement.supports('importmap')) {
    throw new Error('importmap is not supported');
  }
  document.querySelector('main').addEventListener('click', event => {
    const { eventTarget } = event.target.dataset;
    if (typeof listener[eventTarget] === 'function') {
      event.stopPropagation();
      listener[eventTarget]();
    }
  });
};

main();

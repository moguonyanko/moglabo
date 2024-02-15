/**
 * @fileoverview Array関連API調査用スクリプト
 */

class MyArray {
  #array = [];

  constructor(array) {
    // 引数はArray.isArray=falseを返す値かもしれないので
    // 改めて配列化してプロパティに保持する。Array.fromと同じ。
    this.#array = [...array];
  }

  at(index) {
    return this.#array.at(index);
  }
}

const runTest = () => {
  const a1 = new MyArray([1, 2, 3, 4, 5]);
  console.assert(a1.at(0) === 1);
  console.assert(a1.at(-2) === 4);

  const a2 = new MyArray('こんにちは');
  console.assert(a2.at(0) === 'こ');
  console.assert(a2.at(-2) === 'ち');

  // サロゲートペアを使用する文字に対しては正しく動作しない。
  const a3 = new MyArray('𩸽を𠮟る𠮷野家');
  console.assert(a3.at(0) === '𩸽', a3.at(0));
  console.assert(a3.at(2) === '𠮟', a3.at(2));
  console.assert(a3.at(-3) === '𠮷', a3.at(-3));

  const a4 = new MyArray(new Uint8Array([1, 2, 3, 4, 5]));
  console.assert(a4.at(0) === 1);
  console.assert(a4.at(-2) === 4);
};

// DOM

const funcs = {
  getArrayElement: () => {
    const elements = document.querySelectorAll('.sample-list li');
    const ma = new MyArray(elements);
    const input = document.getElementById('arrayIndex');
    const index = parseInt(input.value);
    const result = ma.at(index);
    // Element.closestは親に向かってしか要素を探せない。
    //const output = input.closest('.sample-list + .output');
    const output = document.querySelector('.sample.at .output');
    try {
      output.textContent = result.textContent;
    } catch (err) {
      output.textContent = `${index}の位置の要素は存在しない`;
    }
  },
  arrayWith: () => {
    const oldArray = [1,2,3,4,5]
    const newArray = oldArray.with(1, 2000).with(2, 3000).with(3, 4000)
    const output = document.querySelector(`*[data-event-output='arrayWith']`)
    // oldArrayに副作用が発生しておらず元の値がそのまま出力される。
    output.textContent = `${oldArray} -> ${newArray}`
  }
};

const addListener = () => {
  const main = document.querySelector('main');
  main.addEventListener('click', event => {
    const { eventTarget } = event.target.dataset;
    const func = funcs[eventTarget];
    if (typeof func === 'function') {
      event.stopPropagation();
      func();
    }
  });
};

const main = () => {
  runTest();
  addListener();
};

main();

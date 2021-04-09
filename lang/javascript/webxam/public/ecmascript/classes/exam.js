/**
 * @fileoverview Class関連機能調査用スクリプト
 */
import * as specs from './specs.js';
import TypeManager from './types.js';

const methodNames = {
  getName: 'Get My Sample User Name',
  toString: 'Get String Expression Of My Sample User'
};

/**
 * Computed Instance Class Fields 動作確認用クラス
 */
class Person {
  // ESLintによる文法エラー誤検出を除去する方法が不明なのでprivate fieldを無効化している。
  //#name = 'no name';
  //#age;

  constructor({ name, age }) {
    this.name = name;
    this.age = age;
  }

  // 以下のようには書けない。
  // Object.keys(methodNames).forEach(n => {
  //   [n]() {
  //     return methodNames[n];
  //   }
  // });

  [methodNames.getName]() {
    return this.name.toUpperCase();
  }

  [methodNames.toString]() {
    return `My name is ${this[methodNames.getName]()}, I am ${this.age} years old.`
  }
}

// DOM

const listeners = {
  dumpSampleClass(element) {
    const person = new Person({ name: 'Hoge', age: 67 });
    const output = element.querySelector('.output');
    output.innerHTML += `${person[methodNames.toString]()}<br />`
  },
  dumpImportClass() {
    const info = new specs.SpecInfo('Hello, import class');
    const result = specs.readData(info);
    const output = document.querySelector('.output.dump-import-export');
    output.textContent = result;
  },
  dumpStaticSample() {
    const type = document.querySelector('.primitive-type').value;
    const result = TypeManager.isSupported({ type });
    const output = document.querySelector('.output.dump-static-sample');
    output.textContent = result;
  }
};

const main = () => {
  document.querySelectorAll('.example').forEach(ele => {
    ele.addEventListener('click', event => {
      const et = event.target.dataset.eventTarget,
        listener = listeners[et];
      if (typeof listener !== 'function') {
        return;
      }
      listener(event.currentTarget);
    });
  });
};

main();

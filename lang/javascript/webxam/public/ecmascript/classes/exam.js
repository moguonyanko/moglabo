/**
 * @fileoverview Class関連機能調査用スクリプト
 */

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
  }
};

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.example').forEach(ele => {
    ele.addEventListener('pointerup', event => {
      const et = event.target.dataset.eventTarget,
        listener = listeners[et];
      if (typeof listener !== 'function') {
        return;
      }
      listener(event.currentTarget);
    });
  });
});
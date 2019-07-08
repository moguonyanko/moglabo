/**
 * @fileoverview Class関連機能調査用スクリプト
 */

/**
 * Computed Instance Class Fields 動作確認用クラス
 */
class Person {
  #name = 'no name';
  #age;

  constructor({ name, age }) {
    this.name = name;
    this.age = age;
  }

  ['getName']() {
    return this.name.toUpperCase();
  }

  ['toString']() {
    return `My name is ${this.getName()}, I am ${this.age} years old.`
  }
}

// DOM

const listeners = {
  dumpSampleClass(element) {
    const person = new Person({ name: 'Hoge', age: 67 });
    const output = element.querySelector('.output');
    output.innerHTML += `${person.toString()}<br />`
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
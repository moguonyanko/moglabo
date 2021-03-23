/**
 * @fileoverview globalThis調査用スクリプト
 */

/* eslint-disable no-undef */

const checkThis = () => {
  console.log('this -> ');
  console.log(this);
  console.log('globalThis -> ');
  console.log(globalThis);
  const worker = new Worker('sampleworker.js');
  worker.onmessage = event => {
    console.log(event.data);
    console.log(this);
  };
  worker.postMessage('Check worker self');
};

class Sample {
  constructor() {
    this.func = checkThis;
  }
}

const testThis = () => {
  // checkThis();
  // const obj = { name: 'test' };
  // console.log('*** FUNCTION BIND *** ');
  // const bound = checkThis.bind(obj);
  // bound();
  // const obj2 = {
  //   func() {
  //     checkThis();
  //   }
  // };
  // obj2.func();

  new Sample().func();
};

// DOM 

const setName = function () {
  globalThis.name = '[globalThis name]';
  // ここのselfがglobalThisと同じになる。
  self.name = '[self name]';
  try {
    // このthisはselfと同じになるとは限らない。
    // この関数がArrow Functionで定義されている場合はthisはundefinedになる。
    this.name = '[this name]';
  } catch (err) {
    console.error(`${err.message},this -> ${this}`);
  }
};

const compareThis = () => {
  const obj = { name: '[object name]' };
  const f = setName.bind(obj);
  f();

  const output = document.querySelector('.compare-this .output');
  output.innerHTML = [
    globalThis.name,
    self.name,
    obj.name
  ].join('<br />');
};

const defineGlobalThisProperty = () => {
  globalThis.getText = () => 'Hello globalThis';
  console.log(globalThis.getText);
};

const main = () => {
  testThis();

  compareThis();
  defineGlobalThisProperty();
};

main();

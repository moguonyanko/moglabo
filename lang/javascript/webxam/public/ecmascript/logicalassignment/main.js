/**
 * @fileoverview Logical Assignment調査用スクリプト
 */

class Sample {
  // 可能ならprivateで宣言するべき。
  static defaultValue = 0;
  v = Sample.defaultValue;
  
  constructor(initialValue) {
    this.v ||= initialValue;
  }
  
  get value() {
    return this.v;
  }
  
  set value(v) {
    if (isNaN(parseInt(v))) {
      throw new TypeError(`Invalid value ${v}`);
    }
    // 不必要にsetterが呼び出されなければこのログも出力されない。
    console.info(`Setterが呼び出されました！: ${v}`);
    this.v = v;
  }

  reset() {
    this.v = Sample.defaultValue;
  }

  nullish() {
    this.v = null;
  }

  toString() {
    return `Sample value: ${this.v}`;
  }
}

const runTest = () => {
  const sample = new Sample();

  sample.value = 100;
  // +=ではNaNを引数に渡してsetterを呼び出してしまう。
  // sample.value += 100;
  console.assert(sample.value === 100);

  // setterが呼び出されない。即ちsetterにトリガーされた処理があったとしても実行されない。
  // これは意図しない副作用を回避する狙いを達成する。
  sample.value ||= 200;
  console.assert(sample.value === 100);

  sample.reset();

  // valueがゼロにリセットされたためsetterは呼び出されない。
  sample.value &&= 300;
  console.assert(sample.value === Sample.defaultValue);

  sample.nullish();

  sample.value ??= 400;
  console.assert(sample.value === 400);
};

runTest();

// DOM

const listeners = {
  dumpSampleValues: () => {
    const output = document.querySelector('.output');
    const s = new Sample();
    s.value = 1; 
    output.innerHTML = `= 1 -> ${s}<br />`;
    s.value ||= 2;
    output.innerHTML += `||= 2 -> ${s}<br />`;
    s.reset();
    output.innerHTML += `Reset -> ${s}<br />`;
    s.value &&= 3;
    output.innerHTML += `&&= 3 -> ${s}<br />`;
    s.nullish();
    output.innerHTML += `Nullish -> ${s}<br />`;
    s.value ??= 4;
    output.innerHTML += `??= 4 -> ${s}<br />`;
  }
};

const addListener = () => {
  document.body.addEventListener('click', event => {
    const { eventTarget } = event.target.dataset;
    if (typeof listeners[eventTarget] !== 'function') {
      return;
    }
    event.stopPropagation();
    listeners[eventTarget]();
  });
};

addListener();

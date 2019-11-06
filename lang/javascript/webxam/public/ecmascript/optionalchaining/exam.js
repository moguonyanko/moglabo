/**
 * @fileoverview Optional Chaining調査用スクリプト
 */

const position = {
  x: 1,
  y: 2,
  address: {
    code: 'A001',
    name: 'ABC Town'
  },
  description() {
    return `(x, y) = ${this.x},${this.y}, address is ${this.address.name}`;
  }
};

const sampleFunc = () => 'Hello Sample!';
const sampleNullFunc = null;

const sampleSize = 5;
class SampeValue {
  value = parseInt(Math.random() * 100);
 
  constructor() {
    this.properties = {
      detail: {
        code: this.value ** 2
      },
      value: this.value,
      getName(index) {
        return `NAME${this.value * index}`;
      }
    }
  }
}

const sampleArray = [...function* (size){
  for (let i = 0; i < size; i++) {
    yield new SampeValue;
  }
}(sampleSize)];

const runTest = () => {
  const p = Object.assign({}, position);
  const q = null;

  /* eslint-disable */
  console.log(`x = ${p?.x}, z = ${p?.z}`);
  /* eslint-enable */
  console.log(`address.code = ${p?.address?.['code']}, address.lv = ${p?.address?.['lv']}`);
  // qやsampleNullFuncの定義自体が存在しないとエラーになってしまう。
  console.log(p?.description(), q?.description());
  console.log(sampleFunc?.(), sampleNullFunc?.());

  // 意図的に添字をオーバーさせる。
  for (let i = 0; i < sampleSize; ) {
    console.log(i, sampleArray[++i]?.value);
  }
  for (let i = 0; i < sampleSize; ) {
    // getNameのiでインクリメントを指定するとOptional Chaining operatorにより
    // その前で処理が打ち切られた時にインクリメントされないため無限ループになる。
    //console.log(i, sampleArray[i]?.properties.getName(++i).toLowerCase());
    console.log(i, sampleArray[++i]?.properties.getName(i).toLowerCase());
  }
};
 
window.addEventListener('DOMContentLoaded', () => {
  runTest();
});

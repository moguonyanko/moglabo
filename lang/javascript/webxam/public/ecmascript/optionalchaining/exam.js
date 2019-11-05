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

const runTest = () => {
  const p = Object.assign({}, position);
  const q = null;

  console.log(`x = ${p?.x}, z = ${p?.z}`);
  console.log(`address.code = ${p?.address?.['code']}, address.lv = ${p?.address?.['lv']}`);
  // qやsampleNullFuncの定義自体が存在しないとエラーになってしまう。
  console.log(p?.description(), q?.description());
  console.log(sampleFunc?.(), sampleNullFunc?.());
};
 
window.addEventListener('DOMContentLoaded', () => {
  runTest();
});

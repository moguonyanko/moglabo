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
  /* eslint-disable */
  value = parseInt(Math.random() * 100);
  /* eslint-enable */
 
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
    Object.freeze(this);
  }
}

const sampleArray = [...function* (size){
  for (let i = 0; i < size; i++) {
    yield new SampeValue;
  }
}(sampleSize)];

// DOM

const println = (...content) => {
  const output = document.querySelector('.output');
  output.innerHTML += `<span>${content.join(',')}</span>`;
};

const execute = () => {
  const p = Object.assign({}, position);
  const q = null;

  /* eslint-disable */
  println(`x = ${p?.x}, z = ${p?.z}`);
  /* eslint-enable */
  println(`address.code = ${p?.address?.['code']}, address.lv = ${p?.address?.['lv']}`);
  // qやsampleNullFuncの定義自体が存在しないとエラーになってしまう。
  println(p?.description(), q?.description());
  println(sampleFunc?.(), sampleNullFunc?.());

  // 意図的に添字をオーバーさせる。
  for (let i = 0; i < sampleSize; ) {
    println(i, sampleArray[++i]?.value);
  }
  for (let i = 0; i < sampleSize; ) {
    // getNameのiでインクリメントを指定するとOptional Chaining operatorにより
    // その前で処理が打ち切られた時にインクリメントされないため無限ループになる。
    //display(i, sampleArray[i]?.properties.getName(++i).toLowerCase());
    println(i, sampleArray[++i]?.properties.getName(i).toLowerCase());
  }

  // 削除できた時とプロパティが存在せず削除が発生しなかった時
  // どちらもtrueが返される。
  println(delete p?.x, delete p?.notExistProperty);
  try {
    // sealやfreezeされているプロパティにdeleteを適用すると
    // falseが返るのではなく例外がスローされる。
    println(delete new SampeValue()?.properties)
  } catch(err) {
    println(err.message);
  }
};

const adjustStyle = () => {
  // CSSで要素表示順序を逆にしてもスクロールバーは元の方向にスクロールされてしまう。
  // そこでscrollToで出力要素の最上部にスクロールバーを移動させている。
  const o = document.querySelector('.output');
  o.scroll({top: -parseInt(getComputedStyle(o).getPropertyValue('height'))});  
};

window.addEventListener('DOMContentLoaded', () => {
  execute();
  adjustStyle();
});

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

  println(`x = ${p?.x}, z = ${p?.z}`);
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
  // Optional Chaining operatorにより評価が打ち切られた時もtrueが返る。
  println(delete q?.x);
  try {
    // 以下はシンタックスエラー
    //println(delete new SampeValue?.properties)
    // sealやfreezeされているプロパティにdeleteを適用すると
    // falseが返るのではなく例外がスローされる。
    println(delete new SampeValue()?.properties)
  } catch(err) {
    println(err.message);
  }

  // Grouping
  println((p?.address).name);
  println(p?.nodata?.name); // 空文字
  // 以下はシンタックスエラー
  //println((p?.nodata?).name);
  println((p?.description()).toUpperCase());
  println(q?.address.name); // 空文字
  // 以下はTypeError。Groupingされた最後のプロパティが定義されていない、
  // 即ちundefinedだとエラーになる。
  //println((q?.address).name);
};

const adjustScroll = ({ direction = 'top' }) => {
  const o = document.querySelector('.output');

  switch (direction.toLowerCase()) {
    case 'top': {
      // {}がなければletで宣言してもブロックスコープが形成されない。
      // その場合後続のdegreeで宣言が重複することによるエラーが発生する。
      let degree = -parseInt(getComputedStyle(o).getPropertyValue('height'));
      o.scroll({top: degree});  
      break;
    }
    case 'down': 
      let degree = 0;
      o.scroll({top: degree});  
      break;
    default:
      // Does nothing
  }
};

const listener = {
  upOutput() {
    adjustScroll({ direction: 'top' });
  },
  downOutput() {
    adjustScroll({ direction: 'down' });
  }
};

const addListener = () => {
  const main = document.querySelector('main');
  main.addEventListener('pointerup', event => {
    const et = event.target.dataset.eventTarget;
    if (typeof listener[et] === 'function') {
      event.stopPropagation();
      listener[et]();
    }
  });
};

window.addEventListener('DOMContentLoaded', () => {
  addListener();
  execute();

  // CSSで要素表示順序を逆にしてもスクロールバーは元の方向にスクロールされてしまう。
  // そこで最初にスクロールバーを出力要素の最上部に移動させている。
  adjustScroll({ direction: 'top' });
});

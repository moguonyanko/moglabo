/**
 * @fileOverview Symbol調査用スクリプト
 */

class HelloIterator {
  constructor(sentence) {
    this.words = sentence.split('');
  }

  *[Symbol.iterator]() {
    yield* this.words;
    // 以下のコードでも同じ結果を返す。
    // for (let word of this.words) {
    //   yield word;
    // }
  }
}

/**
 * 参考:
 * https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
 */
const getRandomValues = (size = 1e+10) => {
  const array = new Uint32Array(1);
  const v = crypto.getRandomValues(array)[0] / 4294967295;
  return Math.floor(v * size);
};

// private fieldを使うとエディタが追随できないため現在は使用していない。
class Student {
  // #name = ''
  // #age = null;
  // #id = null;
  constructor({ name, age, id = getRandomValues() }) {
    this.name = name;
    this.age = age;
    this.id = id;
  }

  toString() {
    return `${this.id}: My name is ${this.name}, ${this.age} years old.`;
  }

  [Symbol.toPrimitive](hint) {
    if (hint === 'string') {
      return this.toString();
    }
    // default or number
    return this.id;
  }
}

const runTest = () => {
  const s1 = new Student({
    name: 'Taro', age: 45
  });
  console.log(`Student 1: ${s1}`);

  const s2 = new Student({
    name: 'Jiro', age: 24
  });
  console.log(`Student 2: ${s2}`);
  console.log(`s1 === s2 -> ${s1 === s2}`);

  const s3 = new Student(s1);
  console.log(`Student 3: ${s3}`);
  // Symbol.toPrimitiveの引数hintはdefaultとなる。
  // TODO: +''などとしなくても===演算子を適用した時に
  // 強制的にtoPrimitiveを呼び出させることはできないか？
  // それができればMapにおいてオブジェクトごとに適した比較方法を
  // toPrimitiveに実装し値の追加や取得ができる。
  console.log(`s1 === s3 -> ${s1 + '' === s3 + ''}`);
};

// DOM

const dumpSampleStudents = () => {
  const param = {
    name: 'Mike', age: 18, id: 12345
  };
  const s1 = new Student(param),
    s2 = new Student(param);

  const base = document.querySelector('.example.toprimitive');
  const output = base.querySelector('.output');
  output.innerHTML = [
    `s1: ${s1}`,
    `s2: ${s2}`,
    `s1 === s2: ${s1 === s2}`,
    `s1(default) === s2(default): ${s1 + '' === s2 + ''}`
  ].join('<br />');
};

const runHelloIterator = () => {
  const hi = new HelloIterator('HELLO');
  const output = document.querySelector('.example.iterator .output');
  output.innerHTML = [...hi].join('');
};

window.addEventListener('DOMContentLoaded', () => {
  runTest();

  dumpSampleStudents();
  runHelloIterator();
});

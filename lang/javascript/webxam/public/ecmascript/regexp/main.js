/**
 * @fileoverview 正規表現関連調査用スクリプト
 */

/**
 * String.prototype.matchAllの動作を再定義できる。
 * 同様のことはmatchやreplaceにも可能。
 */
class SampleRegExp extends RegExp {
  
  #newStr = '';

  #regProto = RegExp.prototype;
  #pattern;

  constructor(pattern, flag, newStr) {
    super(pattern, flag);
    this.#pattern = pattern;
    this.#newStr = newStr;    
  }

  [Symbol.matchAll](term) {
    // 再起呼び出しが止まらなくなる。
    // return term.matchAll(this);
    // 同じ文字が1回しかマッチされない。しかも入力値が変化しても初回と同じ結果を返してしまう。
    //const result = super[Symbol.matchAll](this, term);
    const result = this.#regProto[Symbol.matchAll].call(this, term);

    // オーバーライドで戻り値の型を根本的に変えるのは誤用を招くので避けるべきである。
    // 今回は練習のために敢えて行っている。以下のメソッドについても同様。
    return [...result].flatMap(a => Object.assign({}, a));
  }

  // String.prototype.matchAllでは呼び出されない。
  [Symbol.match](term) {
    const result = this.#regProto[Symbol.match].call(this, term);
    // マッチする文字がなかった時resultはnullになる。
    return result?.map(value => Object.assign({}, { value })) ?? [];
  }
  
  // String.prototype.replaceだけでなくString.prototype.replaceAllでも参照される。
  [Symbol.replace](term) {
    const result = this.#regProto[Symbol.replace].call(this, term, this.#newStr);
    return [...result].map(value => Object.assign({}, { value }));
  }

  [Symbol.search](term) {
    // super.patternはundefined
    const index = term.indexOf(this.#pattern);
    return { index };
  }

  [Symbol.split](term, limit) {
    const result = this.#regProto[Symbol.split].call(this, term, limit);
    return result.map((value, index) => `${index}:${value}`);
  }
}

const testMatchAll = () => {
  const reg = new SampleRegExp('[abc]', 'g');
  const result = 'abbcdefg'.matchAll(reg);
  console.log(result);
};

const testReplaceAll = () => {
  const reg = new SampleRegExp('[a-z]', 'g', 'X');
  const result = 'aBcDeFg'.replace(reg);
  // 以下も同じ結果を返す。gオプションが指定された時のreplaceは
  // replaceAllと同じ結果になる。replaceAllはgオプションと併用しないと
  // エラーになる。matchAllと同じ。
  //const result = 'aBcDeFg'.replaceAll(reg);
  console.log(result);
};

const testMatch = () => {
  const reg = new SampleRegExp('[a-zA-Z]', 'g');
  const result = '1234ABC'.match(reg);
  console.log(result);
};

const testSearch = () => {
  const reg = new SampleRegExp('A');
  const result = '1234ABC'.search(reg);
  console.log(result);
};

const testSplit = () => {
  const reg = new SampleRegExp(',');
  const result = 'A,B,C,D,E'.split(reg);
  console.log(result);
};

const runTest = () => {
  testMatchAll();
  testMatch();
  testReplaceAll();
  testSearch();
  testSplit();
};

runTest();

// DOM

const displayResult = (result, selector) => {
  if (!Array.isArray(result)) {
    result = [result];
  }
  const output = document.querySelector(selector);
  output.value = result.map(r => `${JSON.stringify(r)}`).join('\n');
};

const funcs = {
  runMatchAll: () => {
    const term = document.getElementById('inputvalue').value;
    // 引数のEegExpオブジェクトがnon-global(gオプション未指定)だとエラーになる。
    const alphaReg = new SampleRegExp('[a-zA-Z]', 'g');
    const result = term.matchAll(alphaReg);
    displayResult(result, '.output.matchall');
  },
  runMatch: () => {
    const term = document.getElementById('samplevalue').value;
    const alphaReg = new SampleRegExp('[a-zA-Z]', 'g');
    const result = term.match(alphaReg);
    displayResult(result, '.output.match');
  },
  runReplace: () => {
    const term = document.getElementById('replacetarget').value;
    const reg = new SampleRegExp('[a-zA-Z]', 'g', '@');
    const result = term.replace(reg);
    displayResult(result, '.output.replace');
  },
  runSearch: () => {
    const term = document.getElementById('searchtarget').value;
    const word = document.getElementById('searchword').value;
    const reg = new SampleRegExp(word);
    const result = term.search(reg);
    displayResult(result, '.output.search');
  },
  runSplit: () => {
    const term = document.getElementById('splittarget').value;
    const reg = new SampleRegExp(',');
    const result = term.split(reg);
    displayResult(result, '.output.split');
  }
};

const addListener = () => {
  document.querySelector('main').addEventListener('click', event => {
    const { eventTarget } = event.target.dataset;
    if (typeof funcs[eventTarget] !== 'function') {
      return;
    }
    event.stopPropagation();
    funcs[eventTarget]();
  });
};

addListener();

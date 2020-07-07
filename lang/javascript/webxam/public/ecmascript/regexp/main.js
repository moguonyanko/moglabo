/**
 * @fileoverview 正規表現関連調査用スクリプト
 */

/**
 * String.prototype.matchAllの動作を再定義できる。
 * 同様のことはmatchやreplaceにも可能。
 */
class SampleRegExp extends RegExp {
  
  #newStr = '';

  constructor(pattern, flag, newStr) {
    super(pattern, flag);
    this.#newStr = newStr;    
  }

  [Symbol.matchAll](term) {
    // 再起呼び出しが止まらなくなる。
    // return term.matchAll(this);
    // 同じ文字が1回しかマッチされない。しかも入力値が変化しても初回と同じ結果を返してしまう。
    //const result = super[Symbol.matchAll](this, term);
    const result = RegExp.prototype[Symbol.matchAll].call(this, term);

    // オーバーライドで戻り値の型を根本的に変えるのは誤用を招くので避けるべきである。
    // 今回は練習のために敢えて行っている。以下のメソッドについても同様。
    return [...result].flatMap(a => Object.assign({}, a));
  }
  
  // String.prototype.replaceだけでなくString.prototype.replaceAllでも参照される。
  [Symbol.replace](term) {
    const result = RegExp.prototype[Symbol.replace].call(this, term, this.#newStr);
    return [...result].map(value => Object.assign({}, { value }));
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

const runTest = () => {
  testMatchAll();
  testReplaceAll();
};

runTest();

// DOM

const displayResult = (result, selector) => {
  const output = document.querySelector(selector);
  output.value = result.map(r => `${JSON.stringify(r)}`).join('\n');
};

const funcs = {
  runMatch: () => {
    const term = document.getElementById('inputvalue').value;
    // 引数のEegExpオブジェクトがnon-global(gオプション未指定)だとエラーになる。
    const alphaReg = new SampleRegExp('[a-zA-Z]', 'g');
    const result = term.matchAll(alphaReg);
    displayResult(result, '.output.matchall');
  },
  runReplace: () => {
    const term = document.getElementById('replacetarget').value;
    const reg = new SampleRegExp('[a-zA-Z]', 'g', '@');
    const result = term.replace(reg);
    displayResult(result, '.output.replace');
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

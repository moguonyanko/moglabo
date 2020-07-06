/**
 * @fileoverview 正規表現関連調査用スクリプト
 */

/**
 * String.prototype.matchAllの動作を再定義できる。
 * 同様のことはmatchやreplaceにも可能。
 */
class SampleRegExp extends RegExp {
  [Symbol.matchAll](term) {
    // 再起呼び出しが止まらなくなる。
    // return term.matchAll(this);
    // 同じ文字が1回しかマッチされない。しかも入力値が変化しても初回と同じ結果を返してしまう。
    //const result = super[Symbol.matchAll](this, term);
    const result = RegExp.prototype[Symbol.matchAll].call(this, term);

    // オーバーライドで戻り値の型を根本的に変えるのは誤用を招くので避けるべきである。
    // 今回は練習のために敢えて行っている。
    return [...result].flatMap(a => Object.assign({}, a));
  }
}

const runTest = () => {
  const reg = new SampleRegExp('[abc]', 'g');
  const result = 'abbcdefg'.matchAll(reg);
  console.log(result);
};

runTest();

// DOM

const alphaReg = new SampleRegExp('[a-zA-Z]', 'g');

const funcs = {
  runMatch: () => {
    const term = document.getElementById('inputvalue').value;
    // 引数のEegExpオブジェクトがnon-global(gオプション未指定)だとエラーになる。
    const result = term.matchAll(alphaReg);
    const output = document.querySelector('.output');
    output.value = result.map(r => `${JSON.stringify(r)}`).join('\n');
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

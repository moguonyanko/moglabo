/**
 * @fileOverview class field調査用スクリプト
 * @description 2019/03/01時点ではChromeでしか動作しない。
 */
 
// ネイティブHTML要素の拡張であればサードパーティ製ライブラリのスタイルシートも
// 適用されやすくなる。
class Greeting extends HTMLButtonElement {

  static DEFIEND_VALUES = [
    'はじめまして',
    'Good Morning',
    'おはよう',
    'Hello',
    'こんにちは',
    'Good Night',
    'おやすみなさい'
  ];

  // class内であってもstatic fieldへのアクセスはclass名の指定が必須
  value = Greeting.DEFIEND_VALUES[0];

  constructor() {
    super();
    
    // renderがオーバーライドされると危険
    this.render();
    
    this.onclick = this.clicked.bind(this);
  }

  clicked() {
    const index = Math.floor(Math.random() * Greeting.DEFIEND_VALUES.length);
    this.value = Greeting.DEFIEND_VALUES[index];
    window.requestAnimationFrame(this.render.bind(this));
  }

  render() {
    this.textContent = this.value;
  }
}

const listener = {
  appendGreetingButton() {
    // createElementの引数にisを指定したオブジェクトを渡せばcustom elementの
    // コンストラクタが呼び出される。
    const btn = document.createElement('button', { is: 'greeting-button' });
    // 同じ処理を以下の記述でも行える。
    //const btn = new Greeting();
    
    // 「.public-field .container」の間のスペースが無いと両方のclassが指定された
    // 1つの要素を探してしまう。
    // 例: <div class="public-field container"></div>
    const container = document.querySelector('.public-field .container');
    container.appendChild(btn);
  }
};

const init = () => {
  customElements.define('greeting-button', Greeting, { extends: 'button' });
  
  document.querySelectorAll('.example').forEach(el => {
    el.addEventListener('click', event => {
      const t = event.target;
      if (t.classList.contains('eventtarget')) {
        event.stopPropagation();
      }
      if (typeof listener[t.value] === 'function') {
        listener[t.value]();
      }
    });
  });
};

window.addEventListener('DOMContentLoaded', init);

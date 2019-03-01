/**
 * ネイティブHTML要素の拡張であればサードパーティ製ライブラリのスタイルシートも
 * 適用されやすくなる。
 */
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

const init = () => {
  customElements.define('greeting-button', Greeting, { extends: 'button' });
};

window.addEventListener('DOMContentLoaded', init);

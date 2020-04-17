/**
 * @fileoverview ResizeObserver調査用スクリプト
 */

// ResizeObserverの生成時も呼び出されてしまう。
const observeFunc = (entries, observer) => {
  const output = document.querySelector('.output');
  const sampleBox = document.querySelector('.samplebox');
  entries.forEach(entry => {
    let width, height;
    if (entry.contentBoxSize) {
      width = entry.contentBoxSize[0].inlineSize;
      // Observe対象要素がbodyの時はblockSizeは常に同じ値になる。
      height = entry.contentBoxSize[0].blockSize;
    } else {
      width, height = entry.contentRect;
    }
    output.innerHTML = `width=${width},height=${height}<br />`;
    // Observe対象要素のサイズをサンプル要素のサイズに設定する。
    sampleBox.style.width = `${width}px`;
    // heightが固定値でないbodyがObserveされていると異常な高さになってしまう。
    // sampleBox.style.height = `${height}px`;

    // Observeしている要素のサイズに応じたスタイルの切り替えを行う。
    // スタイル切り替えの判定(Control)をCSSのメディアクエリではなく
    // JavaScriptで行うのが容易になったということ。
    sampleBox.classList.remove('big', 'normal');
    if (width > 600) {
      sampleBox.classList.add('big');
    } else {
      sampleBox.classList.add('normal');
    }
  });
};

// CustomElementsもObserveできることを確認するための要素
class MyTextArea extends HTMLTextAreaElement {
  constructor() {
    super();
    this.value = 'サンプルテキスト';
  }
}

const addListener = ({ observer, elements }) => {
  const main = document.querySelector('main');

  main.addEventListener('click', event => {
    if (event.target.id === 'enableObserver') {
      event.stopPropagation();
      if (event.target.checked) {
        elements.forEach(element => observer.observe(element));
      } else {
        // 全ての要素に対するObserveを停止する。
        // 各要素のサイズが相対的な値で設定されていなかった場合、Observe停止時のサイズで
        // 固定される。
        observer.disconnect();
      }
    }
  });

  main.addEventListener('change', event => {
    if (event.target.id === 'resizeRange') {
      event.stopPropagation();
      const ele = document.querySelector(`textarea[is='my-textarea']`);
      ele.style.width = `${event.target.value}px`;
    }
  });
};

const main = () => {
  if (typeof ResizeObserver !== 'function') {
    return;
  }

  const observer = new ResizeObserver(observeFunc);

  customElements.define('my-textarea', MyTextArea, { extends: 'textarea' });
  customElements.whenDefined('my-textarea').then(() => {
    const body = document.querySelector('body');
    observer.observe(body);
    const myText = document.querySelector(`textarea[is='my-textarea']`);
    observer.observe(myText);
    addListener({ observer, elements: [body, myText] });
  });
};

main();
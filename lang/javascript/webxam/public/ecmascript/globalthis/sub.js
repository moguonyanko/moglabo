/* eslint-disable no-undef */

const main = () => {
  // globalThisに親のフレームで定義したプロパティはiframeのスクリプトからは参照できない。
  // window同様globalThisもフレームごとに異なるということである。
  const text = globalThis.getText?.() || 'globalThis getText Undefiend';
  const output = document.querySelector('.output');
  output.textContent = text;
};

main();
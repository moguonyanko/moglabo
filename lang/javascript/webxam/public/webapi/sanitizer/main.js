/**
 * @fileoverview Sanitizer API調査用スクリプト
 */

const funcs = {
  setHTML: () => {
    const output = document.querySelector(".output.setHTML");
    const sanitized = document.getElementById("sanitized").checked;
    const userInput = document.getElementById("userinput").value;
    const html = `<p>MY NAME:${userInput}</p>`;
    // TODO: SanitizerAPIを使わなくてもサニタイズされてしまう。
    if (sanitized) {
      const sanitizer = new Sanitizer();
      output.setHTML(html, sanitizer);
    } else {
      output.innerHTML = html;
    }
  }
};

const addListener = () => {
  const main = document.querySelector('main');
  main.addEventListener('click', event => {
    const { eventListener } = event.target.dataset;
    funcs[eventListener]?.();
  });
};

addListener();

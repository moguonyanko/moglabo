/**
 * @fileoverview Sanitizer API調査用スクリプト
 */

const funcs = {
  basicSanitize: () => {
    const output = document.querySelector(".basicMethod .output");
    const sanitized = document.querySelector(".basicMethod .sanitized").checked;
    const userInput = document.querySelector(".basicMethod .userinput").value;
    if (sanitized) {
      const sanitizer = new Sanitizer();
      output.setHTML(userInput, sanitizer);
    } else {
      output.innerHTML = userInput;
    }
  },
  sanitizeElement: () => {
    const output = document.querySelector(".basicMethod .output");
    const sanitized = document.querySelector(".basicMethod .sanitized").checked;
    const userInput = document.querySelector(".basicMethod .userinput").value;
    if (sanitized) {
      const sanitizer = new Sanitizer();
      // サニタイズされた要素が必要な場合はsanitizeやsanitizeForが有用である。
      // sanitizeは引数にDocumentやDocumentFragmentを求めるので以下はエラーとなる。
      //const element = sanitizer.sanitize(userInput);
      const element = sanitizer.sanitizeFor('div', userInput);
      output.replaceChildren(element);
    } else {
      output.innerHTML = userInput;
    }
  },
  sanitizeScript: () => {
    const output = document.querySelector(".sanitizeConfig .output");
    const sanitized = document.querySelector(".sanitizeConfig .sanitized").checked;
    const userInput = document.querySelector(".sanitizeConfig .userinput").value;
    if (sanitized) {
      // TODO: サニタイズせずにscript要素を追加してもスクリプトが実行されない。
      const sanitizer = new Sanitizer({
        blockElements: ['script']
      });
      output.setHTML(userInput, sanitizer);
    } else {
      output.innerHTML = userInput;
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

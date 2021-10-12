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
  },
  sanitizeAttribute: () => {
    const output = document.querySelector(".sanitizeConfig .output");
    const sanitized = document.querySelector(".sanitizeConfig .sanitized").checked;
    const userInput = document.querySelector(".sanitizeConfig .userinput").value;
    if (sanitized) {
      // p要素はclass属性だけ許可しそれ以外の属性、たとえばonclickなどは除去する。
      const sanitizer = new Sanitizer({
        allowAttributes: { 'class': ['p'] }
      });
      output.replaceChildren(sanitizer.sanitizeFor('span', userInput));
    } else {
      output.innerHTML = userInput;
    }
  },
  sanitizeCustomElements: () => {
    const output = document.querySelector(".sanitizeCustomElements .output");
    const sanitized = document.querySelector(".sanitizeCustomElements .sanitized").checked;
    const sanitizer = new Sanitizer({
      allowCustomElements: sanitized,
      allowElements: ['sample-profile']
    });
    const element = '<sample-profile></sample-profile>';
    output.setHTML(element, sanitizer);
  }
};

const addListener = () => {
  const main = document.querySelector('main');
  main.addEventListener('click', event => {
    const { eventListener } = event.target.dataset;
    funcs[eventListener]?.();
  });
};

const init = () => {
  addListener();

  customElements.define('sample-profile', class extends HTMLElement {
    constructor() {
      super();
      const template = document.getElementById('sample-profile').content;
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(template.cloneNode(true));
    }
  });
};

init();

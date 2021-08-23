/**
 * @fileoverview CSS Module調査用スクリプト
 */

import sheet from './user1.css' assert { type: 'css' };

// LightDOMへのスタイル適用
// こちらのコードはドキュメントのlink要素でCSSが読み込まれていれば必要ない。
//document.adoptedStyleSheets = [sheet];

const init = () => {
  customElements.define('custom-form', class extends HTMLElement {
    constructor() {
      super();
      const template = document.getElementById('custom-form').content;
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(template.cloneNode(true));
      // ShadowDOMへのスタイル適用
      shadowRoot.adoptedStyleSheets = [sheet];
    }
  });

  customElements.define('custom-area', class extends HTMLElement {
    // constructorにasyncは指定できない。
    constructor() {
      super();
      const template = document.getElementById('custom-area').content;
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(template.cloneNode(true));

      // ShadowDOMへのスタイル適用
      let path = this.getAttribute('usercss');
      if (!path.startsWith('./')) {
        path = `./${path}`;
      }
      const cssModule = import(path, {
        assert: { type: 'css' }
      }).then(cssModule => {
        this.shadowRoot.adoptedStyleSheets = [cssModule.default];
      });
    }

    // async connectedCallback() {
    //   // ShadowDOMへのスタイル適用
    //   let path = this.getAttribute('usercss');
    //   if (path.charAt(0) !== '.') {
    //     path = `./${path}`;
    //   }
    //   const cssModule = await import(path, {
    //     assert: { type: 'css' }
    //   });
    //   this.shadowRoot.adoptedStyleSheets = [cssModule.default];
    // }
  });
};

init();

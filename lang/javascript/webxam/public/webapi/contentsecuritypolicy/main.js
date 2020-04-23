/**
 * @fileoverview ContentSecurityPolicy調査用スクリプト
 */

const createHTML = ({ html }) => {
  const myPolicy = trustedTypes.createPolicy('myPolicy', {
    createHTML: s => s // HTMLをそのまま返していてもTurstedHTMLが得られる。
  });
  const trusted = myPolicy.createHTML(html);
  if (trusted instanceof TrustedHTML) {
    // TrustedHTMLなら必ずinnerHTMLの代入といった処理が成功するわけではない。
    return trusted;
  } else {
    return html;
  }
};

const identity = arg => arg;

const funcs = {
  createDefaultPolicy() {
    if (trustedTypes.defaultPolicy) {
      // ポリシー作成済み
      // defaultPolicyは読み取り専用なので一度作成したら削除できない。
      return;
    }
    // defaultの場合、そのまま値を返す関数を渡してcreatePolicy1が呼び出されても
    // エラーが発生しなくなる。無論本来は入力値のサニタイズを行うべきである。
    trustedTypes.createPolicy('default', {
      createHTML: identity,
      createScript: identity,
      createScriptURL: url => {
        // オリジンチェック
        // 今回はlocalhostのScriptのみ許可する。
        if (url.includes('localhost')) {
          return url;
        } else {
          throw new TypeError(`Invalid Script URL: ${url}`);
        }
      }
    });
  },
  async checkTrustedTypes() {
    const p = 'helloworld';
    const url = `https://myhost/webxam/apps/practicenode/reversestring?string=${p}`;
    const output = document.querySelector(`.output.trustedtypes`);

    // urlがクロスオリジンでなくてもエラーになる。証明書の問題か？
    const html = `<a href="${url}">Click Me!</a>`;
    output.innerHTML += html;

    // 以下の方法であればSecurityPolicyViolationEventを発生させないで済む。
    // const a = document.createElement('a');
    // a.setAttribute('href', url);
    // a.appendChild(document.createTextNode('Click Trusted Types'));
    // output.appendChild(a);
  },
  // TrustedScriptとTrustedScriptURLはdefaultのpolicyを生成してもエラーになる。
  createTextContentScript() {
    const container = document.querySelector('.scriptcontainer');
    const script = document.createElement('script');
    script.text = `document.querySelector('main').classList.toggle('emphasis');`;
    container.appendChild(script);
  },
  createExternalScript() {
    const container = document.querySelector('.scriptcontainer');
    const script = document.createElement('script');
    // createPolicyが行われなければクロスオリジンのスクリプトでなくてもエラーになる。
    const url = 'https://localhost/webxam/webapi/contentsecuritypolicy/sample.js';
    script.setAttribute('src', url);
    container.appendChild(script);
  }
};

const addListener = () => {
  const output = document.querySelector('.output.report');

  document.querySelector('body').addEventListener('click',
    event => {
      const { target } = event;
      if (typeof funcs[target.id] !== 'function') {
        return;
      }
      event.stopPropagation();
      output.textContent = '';
      funcs[target.id]();
    });

  window.addEventListener('securitypolicyviolation',
    event => {
      const { sample } = event;
      if (!sample) {
        return; // 今回はTrustedTypes関連のエラー以外は無視する。
      }
      output.textContent = sample;
      console.log(event);
    });
};

const main = () => {
  addListener();
};

main();

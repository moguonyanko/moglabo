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

const funcs = {
  createDefaultPolicy() {
    if (trustedTypes.defaultPolicy) {
      // ポリシー作成済み
      // defaultPolicyは読み取り専用なので一度作成したら削除できない。
      return;
    }
    // defaultの場合、そのままHTMLを返してinnerHTMLに代入してもエラーが発生しなくなる。
    // 当然のことながら本来はHTMLのサニタイズを行うべきである。
    trustedTypes.createPolicy('default', {
      createHTML: s => s
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
    script.text = `alert('Text content script')`;
    container.appendChild(script);
  },
  createExternalScript() {
    const container = document.querySelector('.scriptcontainer');
    const script = document.createElement('script');
    // クロスオリジンのスクリプトでなくてもエラーになる。
    script.src = 'sample.js';
    container.appendChild(script);
  }
};

const addListener = () => {
  const output = document.querySelector('.output.report');

  document.querySelector('main').addEventListener('click',
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

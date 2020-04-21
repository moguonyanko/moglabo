/**
 * @fileoverview ContentSecurityPolicy調査用スクリプト
 */

const funcs = {
  async checkTrustedTypes() {
    const p = 'helloworld';
    const url = `https://myhost/webxam/apps/practicenode/reversestring?string=${p}`;
    const output = document.querySelector(`.output.trustedtypes`);
    
    const html = `<a href="${url}">Click Me!</a>`;
    output.innerHTML += html;

    // 以下の方法であればSecurityPolicyViolationEventを発生させないで済む。
    // const a = document.createElement('a');
    // a.setAttribute('href', url);
    // a.appendChild(document.createTextNode('Click Trusted Types'));
    // output.appendChild(a);
  }
};

const addListener = () => {
  document.querySelector('main').addEventListener('click',
    event => {
      const { target } = event;
      if (typeof funcs[target.id] !== 'function') {
        return;
      }
      event.stopPropagation();
      funcs[target.id]();
    });

  window.addEventListener('securitypolicyviolation',
    event => {
      console.log(event);
      const {sample} = event;
      const output = document.querySelector('.output.report');
      output.innerText = sample;
    });
};

const main = () => {
  addListener();
};

main();

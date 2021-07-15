/**
 * @fileoverview ポップアップの振る舞いを確認するためのスクリプト
 */

const popupFuncs = {
  windowOpen: ({ url }) => {
    window.open(url);
  },
  linkClick: ({ url }) => {
    const a = document.createElement('a');
    a.href = url;
    // 現在のウインドウでリンク先ページを表示してしまう。
    a.click();
  }
};

const popupArgs = {
  // url: 'https://myhost/webxam/webapi/popup/sample.html'
  // url: 'https://www.google.com/search?q=javascript'
  // url: 'https://myhost/webxam/apps/practicenode/forward?search=javascript'
  url: '/webxam/apps/practicenode/meaning?keyword=javascript'
};

const addListener = () => {
  const main = document.querySelector('main');
  main.addEventListener('click', event => {
    const { eventTarget } = event.target.dataset;
    if (typeof popupFuncs[eventTarget] === 'function') {
      event.stopPropagation();
      popupFuncs[eventTarget](popupArgs);
    }
  });
};

const init = () => {
  addListener();
};

init();
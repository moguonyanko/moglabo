/**
 * @fileoverview ポップアップの振る舞いを確認するためのスクリプト
 */

// 関数を分けただけではポップアップ扱いにならない。
const openWindow = url => {
  window.open(url);
};

const popupFuncs = {
  windowOpen: ({ url }) => {
    const img = new Image(400, 400);
    const container = document.querySelector('.imagecontainer');
    container.innerHTML = '';
    // コールバック経由はポップアップとみなされブロック対象となる。
    img.onload = () => {
      container.appendChild(img);
      openWindow(url);
    };
    img.src = 'sampleshape.png';
  },
  linkClick: ({ url }) => {
    const a = document.createElement('a');
    a.href = url;
    // 現在のウインドウでリンク先ページを表示してしまう。
    a.click();
  }
};

const popupArgs = {
  //url: 'https://myhost/webxam/webapi/popup/sample.html'
  //url: 'https://www.google.com/search?q=javascript'
  //url: 'https://myhost/webxam/apps/practicenode/forward?search=javascript'
  url: '/webxam/apps/practicenode/meaning?keyword=javascript'
};

const addListener = () => {
  // jQueryを使うかどうかはポップアップかどうかの判定に直接は関係しない。
  const main = document.querySelector('main');
  main.addEventListener('click', event => {
    const { eventTarget } = event.target.dataset;
    if (typeof popupFuncs[eventTarget] === 'function') {
      event.stopPropagation();
      //setTimeout経由だとユーザーの操作に連動していないとみなされポッポアップ扱いとなる。
      // setTimeout(() => {
      //   popupFuncs[eventTarget](popupArgs);
      // }, 1000);
      popupFuncs[eventTarget](popupArgs);
    }
  });
};

const init = () => {
  addListener();
};

init();

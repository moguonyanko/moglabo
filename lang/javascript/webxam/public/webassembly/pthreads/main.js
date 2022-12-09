const init = () => {
  // わざとクロスオリジンにする。
  // modeをcorsにしてもエラーになってしまう。
  const wasmUrl = '//myhost/webxam/webassembly/pthreads/index.wasm';
  fetch(wasmUrl, { mode: 'cors' })
    .then(m => console.log(m))
    .catch(e => console.error(e));
};

init();

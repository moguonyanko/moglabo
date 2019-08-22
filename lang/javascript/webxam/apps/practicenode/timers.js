/**
 * @fileoverview Timers系API調査用スクリプト
 * 
 * 参考:
 * https://nodejs.org/en/docs/guides/timers-in-node/
 */

/* eslint-disable no-undef */

// eslint-disable-next-line no-unused-vars
const runTest = () => {
  const timeout = setTimeout(arg => {
    console.log('setTimeout', arg);
  }, 1000, 'called');

  // clearTimeoutを呼び出した時のようにsetTimeoutは実行されなくなる。
  timeout.unref();
  console.log('Unref timeout');

  setImmediate(() => {
    // unrefされたsetTimeoutが再度実行されるようになる。
    timeout.ref();
  });
};

runTest();

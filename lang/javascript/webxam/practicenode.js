/**
 * @fileoverview Node.jsの練習をするためのスクリプト
 * 参考:
 * https://nodejs.org/en/docs/guides/
 */

/* eslint-disable no-undef */

const testAsyncNodeApi = () => {
  let number = null;
  const func1 = callback => callback();
  const func2 = callback => {
    process.nextTick(callback);
  };
  const func3 = callback => {
    setImmediate(callback);
  };
  func1(() => console.log('sync', number));
  func3(() => console.log('setImmediate', number));
  func2(() => console.log('nextTick', number));
  number = 100;
};

const main = () => {
  testAsyncNodeApi();
};

main();

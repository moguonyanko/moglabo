/**
 * @fileoverview Cross-document messaging調査用スクリプト
 */

let sendMessage = () => {};

const funcs = {
  openSubWindow: () => {
    const output = document.querySelector('.example.detectmemoryleak .output');
    // subWindowがこの関数の内部でしか参照されないようにすることで
    // GCの対象にならずsubWindowがメモリリークの原因になることを避ける。
    let subWindow = window.open('sub.html');
    subWindow.addEventListener('pagehide', () => {
      if (!subWindow || !subWindow.location.host) {
        // サブウインドウを開いた時はそのまま返す。
        return;
      }
      subWindow = null;
      output.innerHTML += 'Sub Window is closed and set null<br />';
    });

    sendMessage = data => {
      if (!subWindow) {
        return;
      }
      subWindow.postMessage(data, location.origin);
    };
    setTimeout(() => sendMessage((Math.random() * 100).toFixed(0)), 1000);

    self.addEventListener('message', event => {
      if (event.source !== subWindow) {
        return;
      }
      output.innerHTML = `${event.data}<br />`;
    });
  }
};

const addListener = () => {
  const main = document.querySelector('main');
  main.addEventListener('click', event => {
    const {eventTarget} = event.target.dataset;
    if (!eventTarget) {
      return;
    }
    event.stopPropagation();
    // Optional Chaining Operatorを使いすぎるのは好ましくない。
    // 特定のプロパティが存在しない状態が単なるバグであるなら速やかに
    // エラーを送出させプログラムを止めるべきである。
    // たとえば funcs[eventTarget]?.() と記述すればeventTargetが
    // 未定義であってもエラーにならないが、これはプロパティ名の間違いなどの
    // バグである可能性が高いのでエラーを送出させて間違いを通知した方が良い。
    funcs[eventTarget]();
  });
};

const main = () => {
  addListener();
};

main();

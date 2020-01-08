/**
 * @fileoverview Notification API調査用スクリプト
 * Chromeでは通知ウインドウが表示されない。Safariでは表示される。
 */

const simpleNotify = async () => {
  const notfication = new Notification('サンプル', {
    body: 'サンプル通知'
  });
  notfication.addEventListener('show', () => {
    console.log('通知開始');
  });
  notfication.addEventListener('close', () => {
    console.log('通知終了');
  });
  // 早めに通知を閉じたければ自分でcloseを呼び出すしかない。
  setTimeout(() => {
    notfication.close();
  }, 2000);
  const result = await Notification.requestPermission();
  // 通知に対する結果がNotification.permissionに保持されている場合
  // resultはundefindになる。
  return result ?? Notification.permission;
};

// DOM

const action = {
  async requestSimpleNotification() {
    const permission = await simpleNotify();
    const output = document.querySelector('.simpleNotifyResult');
    output.innerHTML += `${permission}<br />`;
  }
};

const noop = () => {};

const init = () => {
  const main = document.querySelector('main');
  main.addEventListener('pointerup', async event => {
    // 独立したCustomElementなどのイベントリスナ登録でなければ
    // 迂闊にstopPropagationを呼び出すべきではないのかもしれない。
    //event.stopPropagation();
    await (action[event.target.dataset?.action] ?? noop)();
  });
  main.parentNode.addEventListener('pointerup', event => {
    console.log(`${event.type}が${event.currentTarget.tagName}に伝搬しました。`);
  });
};

init();

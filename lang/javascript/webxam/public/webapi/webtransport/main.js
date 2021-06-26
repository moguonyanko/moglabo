/**
 * @fileoverview WebTransport調査用スクリプト
 */

const testWT = async url => {
  const wt = new WebTransport(url);
  
  try {
    await wt.ready;
    await wt.closed;
    return `${url}への接続は正常終了しました`;
  } catch (err) {
    return `${url}への接続はエラーにより終了しました。${err.message}`;    
  }
};

const listener = {
  onload: {
    testWebTransport: async () => {
      const url = 'https://localhost/webxam/';
      const output = document.querySelector(`div[data-event-output='testWebTransport']`);
      const result = await testWT(url);
      output.textContent = result;
    }
  }
};

const init = async () => {
  Object.values(listener.onload).forEach(async f => await f());
};

init().then();

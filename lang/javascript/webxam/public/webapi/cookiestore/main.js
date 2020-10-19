/**
 * @fileoverview CookieStoreAPI調査用スクリプト
 */

class MyCookieStore {
  constructor() {
    this.store = window.cookieStore;
  }

  async setCookie({ name, value }) {
    await this.store.set({ name, value });
  }

  async getCookie(name) {
    return await this.store.get(name);
  }
}

const runTest = async () => {
  const cm = new MyCookieStore();
  await cm.setCookie({
    name: 'myid',
    value: 'test12345'
  });
  const cookie = await cm.getCookie('id');
  console.log(cookie);
};

// DOM

const dumpCookie = ({ cookie, query }) => {
  const output = document.querySelector(query);
  output.innerHTML = JSON.stringify(cookie);
};

const cm = new MyCookieStore();
let preCookie;

const funcs = {
  getCookieInfo: async () => {
    const value = document.querySelector('.cookie-number').value;
    const name = 'number', query = '.output.cookie-info';
    if (!preCookie) {
      dumpCookie({
        cookie: await cm.getCookie('number'),
        query
      });
      // Cookieの値が変化していなくてもchangeイベントは発生する。
      // setが行われたかどうかだけで判定されているようだ。
      cm.store.addEventListener('change', event => {
        for (const cookie of event.changed) {
          if (cookie.name === name) {
            console.log(`${preCookie?.value} -> ${cookie.value}`);
            dumpCookie({ cookie, query });
          }
        }
        for (const cookie of event.deleted) {
          if (cookie.name === name) {
            // cookie.valueはdeleteされた時点でプロパティごと削除されている。
            console.log(`${cookie.name} deleted`);
            dumpCookie({ cookie, query });
          }
        }
    });
    }
    preCookie = await cm.getCookie('number');
    await cm.setCookie({ name, value });
  }
};

const addListener = () => {
  const main = document.querySelector('main');
  main.addEventListener('click', async event => {
    const { eventTarget } = event.target.dataset;
    if (typeof funcs[eventTarget] == 'function') {
      event.stopPropagation();
      await funcs[eventTarget](event.target);
    }
  });
};

const main = async () => {
  await runTest();
  addListener();
};

Promise.resolve(main());

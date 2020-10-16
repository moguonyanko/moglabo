/**
 * @fileoverview CookieStoreAPI調査用スクリプト
 */

class MyCookieStore {
  constructor() {
    this.store = cookieStore;
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

const funcs = {
  getCookieInfo: async () => {
    const value = document.querySelector('.cookie-number').value;
    const cm = new MyCookieStore();
    await cm.setCookie({
      name: 'number',
      value
    });
    const cookie = await cm.getCookie('number');
    const output = document.querySelector('.output.cookie-info');
    output.innerHTML = JSON.stringify(cookie);
  }
};

const addListener = () => {
  const main = document.querySelector('main');
  main.addEventListener('click', async event => {
    const { eventTarget } = event.target.dataset;
    await funcs[eventTarget](event.target);
  });
};

const main = async () => {
  await runTest();
  addListener();
};

main().then();
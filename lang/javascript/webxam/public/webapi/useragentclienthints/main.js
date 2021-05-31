/**
 * @fileoverview User-Agent Client Hints調査用スクリプト
 */

const getUAData = () => navigator.userAgentData;

const getEntroyValue = async name => {
  const uaData = getUAData();
  const ua = await uaData.getHighEntropyValues([name]);
  return ua[name];
};

// DOM

const listeners = {
  getEntropy: async () => {
    const name = document.querySelector('.entropy').value;
    const result = await getEntroyValue(name);
    const output = document.querySelector(`div[data-event-dst]`);
    output.textContent = result;
  }
};

const addListenrs = () => {
  const main = document.querySelector('main');
  main.addEventListener('click', async event => {
    const { eventSrc } = event.target.dataset;
    if (!eventSrc) {
      return;
    }
    if (typeof listeners[eventSrc] === 'function') {
      event.stopPropagation();
      await listeners[eventSrc]();
    }    
  });
};

const init = () => {
  addListenrs();
};

init();

/**
 * @fileoverview User-Agent Client Hints調査用スクリプト
 */

const getUAData = () => navigator.userAgentData;

const getEntroyValue = async name => {
  const uaData = getUAData();
  const ua = await uaData.getHighEntropyValues([name]);
  console.log(ua);
  return ua[name];
};

const getBrands = () => {
  const uaData = getUAData();
  return uaData.brands.map(item => item.brand);
};

// DOM

const onClick = {
  getEntropy: async () => {
    const name = document.querySelector('.entropy').value;
    const result = await getEntroyValue(name);
    const output = document.querySelector(`div[data-event-dst='getEntropy']`);
    output.textContent = result;
  }
};

const onInit = {
  getBrands: () => {
    const brands = getBrands();
    const output = document.querySelector(`div[data-event-dst='getBrands']`);
    output.textContent = brands;
  }
};

const addListenrs = () => {
  const main = document.querySelector('main');
  main.addEventListener('click', async event => {
    const { eventSrc } = event.target.dataset;
    if (!eventSrc) {
      return;
    }
    if (typeof onClick[eventSrc] === 'function') {
      event.stopPropagation();
      await onClick[eventSrc]();
    }    
  });
};

const init = () => {
  addListenrs();
  Object.values(onInit).forEach(f => f());
};

init();

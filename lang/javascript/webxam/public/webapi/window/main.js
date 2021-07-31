/**
 * @fileoverview Window関連API調査用スクリプト
 */

const funcs = {
  isExtended: () => {
    const result = window.screen.isExtended;
    const output = document.querySelector('.output.isExtended');
    output.textContent = result;
  },
  getScreens: async () => {
    const scs = await window.getScreens();
    const output = document.querySelector('.output.getScreens');
    const result = scs.screens.map((s, index) => {
      return [
        `Window ${index}`,
        `isExtended: ${s.isExtended}`,
        `isInternal: ${s.isInternal}`,
        `isPrimary: ${s.isPrimary}`
      ];
    }).reduce((acc, current) => {
      acc.push(current);
      return acc;
    }, []);
    output.textContent = result.join('<br />');
  }
};

const addListener = () => {
  document.querySelector('main').addEventListener('click', async event => {
    await funcs[event.target.dataset.listener]();
  });
};

addListener();

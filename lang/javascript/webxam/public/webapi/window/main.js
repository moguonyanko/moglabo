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
  },
  screensChange: scs => {
    const screenLength = scs.screens.length;
    const output = document.querySelector('.output.screensChange');
    output.textContent = `Screen length = ${screenLength}`;
  },
  currentscreenChange: scs => {
    const output = document.querySelector('.output.currentscreenChange');
    output.textContent = `Screen length = ${scs.currentScreen}`;
  },
  changeFullScreen: async () => {
    const scs = await window.getScreens();
    const screen = scs.screens.filter(screen => screen.primary)[0];
    await document.body.requestFullscreen({ screen });
  }
};

const addListener = async () => {
  document.querySelector('main').addEventListener('click', async event => {
    await funcs[event.target.dataset.listener]();
  });

  const scs = await window.getScreens();
  scs.addEventListener('screenschange', () => {
    funcs.screensChange(scs);
  });
  scs.addEventListener('currentscreenchange', () => {
    funcs.currentscreenChange(scs);
  });
};

addListener().then();
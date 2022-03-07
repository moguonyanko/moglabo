/**
 * @fileoverview Window関連API調査用スクリプト
 */

let screenLength;

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
    const output = document.querySelector('.output.screensChange');
    const newScreenLength = scs.screens.length;
    if (newScreenLength !== screenLength) {
      output.textContent = `Screen length is changed ${screenLength} to ${newScreenLength}`;
      screenLength = newScreenLength;
    } else {
      output.textContent = `Screen length is not changed ${screenLength}`;
    }
  },
  currentscreenChange: scs => {
    const output = document.querySelector('.output.currentscreenChange');
    console.log(scs.currentScreen);
    output.textContent = `Current screen = ${scs.currentScreen.label}`;
  },
  changeFullScreen: async () => {
    const scs = await window.getScreens();
    const screen = scs.screens.filter(screen => screen.primary)[0];
    await document.body.requestFullscreen({ screen });
  }
};

const addListener = scs => {
  document.querySelector('main').addEventListener('click', async event => {
    await funcs[event.target.dataset.listener]();
  });

  scs.addEventListener('screenschange', () => {
    funcs.screensChange(scs);
  });
  scs.addEventListener('currentscreenchange', () => {
    funcs.currentscreenChange(scs);
  });
};

const initScreens = async () => {
  if (typeof window.getScreenDetails === 'function') {
    if (typeof window.getScreens !== 'function') {
      window.getScreens = () => window.getScreenDetails();
    }
    const scs = await window.getScreens();
    screenLength = scs.screens.length;
    return addListener(scs);
  } else {
    throw new Error('Unsupported multi screen window API');
  }
};

const init = () => {
  navigator.permissions.query({ name: 'window-placement' })
    .then(result => {
      const { state } = result;
      if (state === 'granted') {
        console.log(`Succeeded window-placement: ${state}`);
        return initScreens();
      } else {
        throw new Error(`Failed window-placement: ${state}`);
      }
    })
    .catch(e => console.error(e));
};

init();

/**
 * @fileoverview HTML要素の調査用スクリプト
 */

const funcs = {
  openDialog: () => {
    const dialog = document.getElementById('inertTestDialog');
    dialog.showModal();
    const main = document.querySelector('main');
    main.setAttribute('inert', 'true');
  },
  closeDialog: () => {
    const dialog = document.getElementById('inertTestDialog');
    dialog.close();
    const main = document.querySelector('main');
    main.removeAttribute('inert');
  }
};

const init = () => {
  document.body.addEventListener('click', event => {
    const { eventTarget } = event.target.dataset;
    if (eventTarget) {
      event.stopPropagation();
      if (typeof funcs[eventTarget] === 'function') {
        funcs[eventTarget]();
      }
    }
  });
};

init();
/**
 * @fileoverview CSS Containment調査用スクリプト
 */

const listeners = {
  floatSample: () => {
    const contains = document.querySelector('.contains');
    contains.addEventListener('click', event => {
      const { checked, value } = event.target;
      if (checked) {
        document.querySelectorAll('article')
          .forEach(el => el.style.contain = value);
      }
    });
  }
};

const addListener = () => {
  Object.values(listeners).forEach(listener => listener());
};

addListener();

import PointerInfo from './pointerevent.js';

window.addEventListener('DOMContentLoaded', () => {
  customElements.define('pointer-info', PointerInfo, {extends: 'div'});
});

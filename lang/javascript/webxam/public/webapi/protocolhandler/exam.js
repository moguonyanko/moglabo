/**
 * @fileoverview Protocol Handler調査用スクリプト
 */

const init = () => {
  navigator.registerProtocolHandler(
    'web+webxamservice',
    // クロスオリジンになるとFirefox、Chrome共にエラー。
    // Chromeでは%sを含まないとエラーになる。
    'https://localhost/webxam/service/%s',
    'WebXam Service');
};

window.addEventListener('DOMContentLoaded', init);

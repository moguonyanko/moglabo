/**
 * @fileoverview Protocol Handler調査用スクリプト
 */

const init = () => {
  navigator.registerProtocolHandler(
    'web+webxamservice',
    'webxam/service/%s',
    'WebXam Service');
};

window.addEventListener('DOMContentLoaded', init);

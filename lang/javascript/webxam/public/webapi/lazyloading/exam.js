/**
 * @fileoverview Lazy-Loading調査用スクリプト
 */

const enableLoadingAttribute = () => {
    return 'loading' in HTMLImageElement.prototype && 
        'loading' in HTMLIFrameElement.prototype;
};

 window.addEventListener('DOMContentLoaded', () => {
    if (!enableLoadingAttribute()) {
        console.error('Lazy-Loading is unsupported');
    }
 });

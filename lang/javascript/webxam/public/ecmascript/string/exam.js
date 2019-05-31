/**
 * @fileoverview String調査用スクリプト
 */

// DOM

const funcs = {
    matchAll(ele) {
        const sampleText = ele.querySelector('.sample-text').value,
            matcher = ele.querySelector('.matcher').value;
        const result = sampleText.matchAll(new RegExp(matcher, 'g'));    
        const output = ele.querySelector('.output');
        output.innerHTML = [...result];
    }
};

window.addEventListener('DOMContentLoaded', () => {
    const eles = document.querySelectorAll('.example');
    eles.forEach(ele => {
        ele.addEventListener('pointerup', event => {
            const t = event.target.dataset.eventTarget;
            if (!t) {
                return;
            }
            if (typeof funcs[t] === 'function') {
                funcs[t](ele);
            }
        });
    });
});
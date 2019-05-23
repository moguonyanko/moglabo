/**
 * @fileoverview Fetch調査用スクリプト
 */

const fetchRandomString = async ({ lineLimit }) => {
    const response = await fetch(`/webxam/service/randomString?linelimit=${lineLimit}`);
    if (!response.ok) {
        throw new Error(`Failed to get random string: ${response.status}`);
    }
    return await response.text();
};

// DOM

const listeners = {
    async getRandomString(element) {
        const lineLimit = element.querySelector('.linelimit').value;
        const value = await fetchRandomString({ lineLimit });
        const output = element.querySelector('.output');
        output.innerHTML += `${value}<br />`;
    },
    clearString(element) {
        element.querySelector('.output').innerHTML = '';
    }
};

window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.example').forEach(el => {
        el.addEventListener('pointerup', async event => {
            const et = event.target.dataset.eventTarget;
            if (et) {
                event.stopPropagation();
                if (typeof listeners[et] === 'function') {
                    await listeners[et](el);
                }
            }
        });
    });
});

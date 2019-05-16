/**
 * @fileoverview URLを使ったJavaScript及びNodeJSのAPI調査用スクリプト
 * 参考:
 * https://www.w3schools.com/nodejs/nodejs_http.asp
 */

const funcs = {
    async echoQuery() {
        const date = new Date();
        const sampleUrl = 
        `/webxam/service/echoQuery?year=${date.getFullYear()}&month=${date.getMonth() + 1}&date=${date.getDate()}`;
        const response = await fetch(sampleUrl);
        if (!response.ok) {
            throw new Error(`Request is failed: ${response.status}`);
        }
        const json = await response.json();
        return json.value;
    }
};

// DOM

window.addEventListener('DOMContentLoaded', () => {
    Array.from(document.querySelectorAll('section.example')).forEach(root => {
        root.addEventListener('pointerup', async event => {
            const element = event.target;
            if (element.dataset.eventTarget) {
                event.stopPropagation;
                if (typeof funcs[element.dataset.eventTarget] === 'function') {
                    const result = await funcs[element.dataset.eventTarget]();
                    const output = root.querySelector('.output');
                    output.appendChild(document.createTextNode(result));
                    output.appendChild(document.createElement('br'));
                }
            }
        });
    });
});

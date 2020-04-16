/**
 * @fileoverview Fetch調査用スクリプト
 */

 // TODO: URL短縮処理の実装
const shortParam = async ({ param }) => {
    // URLオブジェクトを介してもマルチバイト文字以外はパーセントエンコーディングされない。
    // +などエンコーディング必要な文字をもれなくエンコーディングするには自前でやる必要がある。
    const kvs = param.split('&').map(kv => {
        const [key, value] = kv.split('=');
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    });
    const p = kvs.join('&');
    const url = `https://localhost/webxam/apps/practicenode/shorturl?${p}`;
    const response = await fetch(url, {
        credentials: 'include',
        mode: 'cors'
    });
    const json = await response.json();
    json.original = param;
    return json;
};

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
    },
    async shortParameter(root) {
        const param = document.getElementById('sampleparam').value;
        const result = await shortParam({ param });
        const output = root.querySelector('.output');
        output.innerHTML += `${JSON.stringify(result)}<br />`;
    }
};

document.querySelectorAll('.example').forEach(el => {
    el.addEventListener('click', async event => {
        const et = event.target.dataset.eventTarget;
        if (typeof listeners[et] === 'function') {
            event.stopPropagation();
            await listeners[et](el);
        }
    });
});

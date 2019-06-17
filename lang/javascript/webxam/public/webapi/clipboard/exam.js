/**
 * @fileoverview Clipboard API調査用スクリプト
 */

// DOM

const clipboard = {
    read: 'clipboard-read',
    write: 'clipboard-write'
};

const permit = async name => {
    const { state } = await navigator.permissions.query({ name });
    switch (state) {
        case 'granted':
        case 'prompt':
            return true;
        default:
            return false;
    }
};

const outputError = ({ output, error }) => {
    output.innerHTML += `<span class="error">${error.message}<span><br />`;
};

const clipTextListeners = {
    async [clipboard.read](root) {
        const output = root.querySelector('.output');
        try {
            const text = await navigator.clipboard.readText();
            output.innerHTML += `${text}<br />`
        } catch (error) {
            outputError({ output, error });
        }
    },
    async [clipboard.write](root) {
        const output = root.querySelector('.output');
        try {
            const text = root.querySelector('.sample-text').value;
            await navigator.clipboard.writeText(text);
        } catch (error) {
            outputError({ output, error });
        }
    }
};

const imageToBlob = async ({ image, type, quality }) => {
    const canvas = new OffscreenCanvas(image.width, image.height);
    canvas.getContext('2d').drawImage(image, 0, 0);
    return await canvas.convertToBlob({ type, quality });
};

const createImage = blob => {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };
        img.onerror = err => {
            URL.revokeObjectURL(url);
            reject(err);
        };
        img.src = url;
    });
};

// TODO: Blobのコピーが行えていない。
const clipImageListeners = {
    async [clipboard.read](root) {
        const output = root.querySelector('.output');
        try {
            const items = await navigator.clipboard.read();
            const blob = await items[0].getType('image/png');
            const img = await createImage(blob);
            output.appendChild(img);
        } catch (error) {
            outputError({ output, error });
        }
    },
    async [clipboard.write](root) {
        const output = root.querySelector('.output');
        try {
            const image = root.querySelector('.sample-image');
            const blob = await imageToBlob({ image, type: 'image/png' });
            // for Test
            //const img = await createImage(blob);
            //output.appendChild(img);
            await navigator.clipboard.write(blob);
        } catch (error) {
            outputError({ output, error });
        }
    }
};

const listeners = {
    clipText: clipTextListeners,
    clipImage: clipImageListeners
};

const init = () => {
    document.querySelectorAll('.example').forEach(root => {
        root.addEventListener('pointerup', async event => {
            const ct = event.currentTarget.dataset.eventTarget;
            if (!ct) {
                return;
            }
            const listener = listeners[ct];
            const et = event.target.dataset.eventTarget;
            if (typeof listener[et] === 'function' &&
                await permit(et)) {
                await listener[et](root);
            }
        });
    });
};

window.addEventListener('DOMContentLoaded', init);

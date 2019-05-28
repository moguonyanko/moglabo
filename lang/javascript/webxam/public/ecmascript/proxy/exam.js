/**
 * @fileoverview Proxy調査用スクリプト
 */

const createVirtualMultipleArray = n => {
    if (isNaN(n)) {
        throw new Error(`${n} is not a number`);
    }
    const handler = {
        get(target, index) {
            return index * n;
        },
        has(target, number) {
            return number % n === 0;
        }
    };
    return new Proxy([], handler);
};

// DOM 

const listeners = {
    createArray(root) {
        const output = root.querySelector('.output');
        const n = parseInt(root.querySelector('.base').value);
        output.innerHTML = `Created ${n} multiple array`;
        const array = createVirtualMultipleArray(n);
        root.addEventListener('input', event => {
            if (event.target.dataset.eventTarget !== 'testValue') {
                return;
            }
            const v = parseInt(event.target.value);
            if (v in array) {
                output.innerHTML = `${v} is a multiple of ${n}`;
            } else {
                output.innerHTML = `${v} is not a multiple of ${n}`;
            }
        });
    }
};

const emitEvent = (event, root) => {
    const name = event.target.dataset.eventTarget;
    if (!name) {
        return;
    }
    event.stopPropagation();
    if (typeof listeners[name] === 'function') {
        listeners[name](root);
    }
};

const addListener = () => {
    const exams = document.querySelectorAll('.example');
    Array.from(exams).forEach(root => {
        root.addEventListener('pointerup', event => {
            emitEvent(event, root);
        });
    });
};

window.addEventListener('DOMContentLoaded', () => {
    addListener();
});

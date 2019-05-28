/**
 * @fileoverview Proxy調査用スクリプト
 */

const traceNewInstance = ({klass, onTrace}) => {
    const handler = {
        construct(target, args, newTarget) {
            if (typeof onTrace === 'function') {
                onTrace(target, args, newTarget);
            }
            // newTargetをnewするとnew演算子によるインスタンス生成時に
            // スタックオーバーフローになる。
            return new target(...args);
        }
    };
    return new Proxy(klass, handler);
};

function Sample() {}

// classで宣言するとSample.applyがエラーになる。
Sample.prototype.toString = () => 'This is Sample class';

function Other() {}

Other.prototype.toString = () => 'This is Other class';

const createInstance = ({type, onTrace}) => {
    const P = traceNewInstance({klass: Sample, onTrace});
    const sampleArgs = ['Hello', 123, true];
    if (type === 'reflect') {
        return Reflect.construct(P, sampleArgs, Other);
    } else if (type === 'object') {
        // Object.createはProxyのhandler.construct()でトラップされない。
        const o = Object.create(P.prototype);
        Other.apply(o, sampleArgs);
        return o;
    } else {
        return new P(...sampleArgs);
    }
}

const createVirtualMultipleArray = n => {
    if (isNaN(n)) {
        throw new Error(`${n} is not a number`);
    }
    const handler = {
        get(target, index) {
            return index * n;
        },
        // in演算子で要素を調べた時に呼び出される。配列に対しても同様。
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
    },
    checkConstruction(root, target) {
        const type = target.value;
        const output = root.querySelector('.output');
        output.innerHTML = '';
        const onTrace = (target, args, newTarget) => {
            const log = `Trapped: ${target.name}, ${args.join(',')}, ${newTarget.name}<br />`;
            output.innerHTML += log;
        };
        const instance = createInstance({type, onTrace});
        output.innerHTML += `${instance.toString()}<br />`;
    }
};

const emitEvent = (event, root) => {
    const name = event.target.dataset.eventTarget;
    if (!name) {
        return;
    }
    event.stopPropagation();
    if (typeof listeners[name] === 'function') {
        listeners[name](root, event.target);
    }
};

const addListener = () => {
    const exams = document.querySelectorAll('.example');
    Array.from(exams).forEach(root => {
        // radioに対してはpointerupが発生しない。
        root.addEventListener('click', event => {
            emitEvent(event, root);
        });
    });
};

window.addEventListener('DOMContentLoaded', () => {
    addListener();
});

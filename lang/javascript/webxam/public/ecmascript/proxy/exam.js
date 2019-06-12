/**
 * @fileoverview Proxy調査用スクリプト
 */

const traceNewInstance = ({ klass, onTrace }) => {
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

function Sample() { }

// classで宣言するとSample.applyがエラーになる。
Sample.prototype.toString = () => 'This is Sample class';

function Other() { }

Other.prototype.toString = () => 'This is Other class';

const createInstance = ({ type, onTrace }) => {
    const P = traceNewInstance({ klass: Sample, onTrace });
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

const overrideOwnKeys = (obj, keys = []) => {
    const proxy = new Proxy(obj, {
        ownKeys(target) {
            // 配列あるいは配列のようなオブジェクトを戻り値にしないと実行時エラーとなる。
            return Reflect.ownKeys(target).concat(keys);
        }
    });
    return proxy;
};

const createRevocable = () => {
    const target = {
        greeting() {
            return 'Hello';
        }
    };
    const handler = {
        get(target, name) {
            if (name === 'greeting') {
                return () => 'こんにちは';
            } else {
                if (typeof target[name] === 'function') {
                    return target[name]();
                } else {
                    return target[name];
                }
            }
        }
    };
    return Proxy.revocable(target, handler);
};

// Normal
const fibonacci = n => {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
};

// Memo
const fibMemo = (n, memo = {}) => {
    if (n <= 1) return n;
    if (n in memo) {
        return memo[n];
    }
    memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
    return memo[n];
};

const fib = {
    getValue(n) {
        return fibonacci(n);
    }
};

const memoizeFib = () => {
    return new Proxy(fib, {
        get(target, name) {
            if (name === 'getValue') {
                return n => fibMemo(n);
            } else {
                return target[name];
            }
        }
    });
};

// Memo with Proxy
const createFibonacciProxy = () => {
    return new Proxy({}, {
        get(target, n) {
            if (n <= 1) {
                return n;
            }
            if (n in target) {
                return target[n];
            }
            target[n] = this.get(target, n - 1) + this.get(target, n - 2);
            return target[n];
        }
    });
};

const runTest = () => {
    const n = 70;
    console.log(`fibonacci with memo n = ${n}: ${fibMemo(n)}`);
    const proxy = createFibonacciProxy();
    console.log(`fibonacci with memo and proxy n = ${n}: ${proxy[n]}`);
    // Normal version is too slowly
    //console.log(`fibonacci without memo n = ${n}: ${fibonacci(n)}`);
};

// DOM 

let revokable;

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
        const instance = createInstance({ type, onTrace });
        output.innerHTML += `${instance.toString()}<br />`;
    },
    trapKeys(root) {
        const output = root.querySelector('.output');
        const exProps = root.querySelector('.extends-property').value
            .split(',')
            .map(p => p.trim());
        const sampleObj = {
            originalName: 'My Object',
            originalFunc: () => { return 1; },
            [Symbol('password')]: 'secret'
        };
        const obj = overrideOwnKeys(sampleObj, exProps);
        // Object.keysはProxy.ownKeysでトラップされるが実際の戻り値には反映されない。
        output.innerHTML =
            `Object.keys -> ${Object.keys(obj).join(',')}<br />`;
        output.innerHTML +=
            `Object.getOwnPropertyNames -> ${Object.getOwnPropertyNames(obj).join(',')}<br />`;
        output.innerHTML +=
            `Object.getOwnPropertySymbols -> ${Object.getOwnPropertySymbols(obj).map(s => s.toString()).join(',')}<br />`;
        output.innerHTML +=
            `Reflect.ownKeys -> ${Reflect.ownKeys(obj).map(s => s.toString()).join(',')}<br />`;
    },
    runRevocableProxy(root, target) {
        const output = root.querySelector('.output');
        if (target.hasAttribute('data-create-proxy')) {
            if (!revokable) {
                output.innerHTML = '';
                revokable = createRevocable();
            }
            const p = revokable.proxy;
            try {
                output.innerHTML += `${p.greeting()}<br />`;
            } catch (err) {
                output.innerHTML += `${err.message}<br />`;
                revokable = null;
            }
        } else if (target.hasAttribute('data-revoke-proxy') && revokable) {
            revokable.revoke();
        }
    },
    calcFib(root) {
        const output = root.querySelector('.output'),
            n = parseInt(root.querySelector('.fibnumber').value);
        if (isNaN(n)) {
            output.innerHTML = `n is not number`;
            return;
        }
        const proxy = createFibonacciProxy();
        const result = proxy[n];
        output.innerHTML = `n = ${n}, fibonacci = ${result}`;
    },
    getFibonacciValue(root) {
        const output = root.querySelector('.output'),
            n = parseInt(root.querySelector('.fibnumber').value),
            useProxy = root.querySelector('.use-proxy').checked;
        if (isNaN(n)) {
            output.innerHTML = `n is not number`;
            return;
        }
        const f = useProxy ? memoizeFib() : fib;
        const result = f.getValue(n);
        output.innerHTML += `n = ${n}, fibonacci = ${result}<br />`;
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
    runTest();

    addListener();
});

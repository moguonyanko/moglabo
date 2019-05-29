/**
 * @fileoverview Generator調査用スクリプト
 */

const mainGenerator = function* ({ onStart, onEnd }, ...generatores) {
    onStart('Start main generator');
    // yield*で引数のジェネレータに処理を委譲する。
    for (let g of generatores) {
        yield* g;
    }
    // 以下も同じ結果を返す。
    //yield generatores.forEach(g => [...g]);
    // 以下では上手く委譲できない。
    //yield generatores.forEach(function* (g) { yield* g; });
    onEnd('Finish all generators');
};

const subGenerator = function* (callback, ...values) {
    for (let v of values) {
        yield v;
        callback(v);
    }
};

// DOM

const funcs = {
    chainGenerator(root) {
        const output = root.querySelector('.output');
        const f = value => output.innerHTML += `${value}<br />`;

        const g1 = subGenerator(f, 1, 2, 3, 4, 5);
        const g2 = subGenerator(f, 6, 7, 8);
        const g3 = subGenerator(f, 100, 200, 300);
        const main = mainGenerator({
            onStart: f, onEnd: f
        }, g1, g2, g3);

        // 完了するまでジェネレータを評価する。
        [...main];
    }
};

window.addEventListener('DOMContentLoaded', () => {
    const exams = Array.from(document.querySelectorAll('.example'));
    exams.forEach(exampleElement => {
        exampleElement.addEventListener('pointerup', event => {
            if (!event.target.dataset.eventTarget) {
                return;
            }
            const target = event.target.dataset.eventTarget;
            if (typeof funcs[target] === 'function') {
                funcs[target](exampleElement);
            }
        });
    });
});

import op from "./operations.js";

const calc = ({operation, m1Values, m2Values}) => {
    if (typeof op[operation] === "function") {
        const [m11, m12, m21, m22] = m1Values;
        const t1 = tf.tensor2d([[m11, m12], [m21, m22]]);
        const [a, b, c, d] = m2Values;
        const t2 = tf.tensor2d([[a, b], [c, d]]);
        return op[operation]({t1, t2});
    } else {
        throw new TypeError(`Not supported operation: ${operation}`);
    }
};

const output = value => {
    const result = document.querySelector(".result");
    result.innerHTML = `${value.toString()}<br />`;
};

const doCalc = (base = document) => {
    // querySelectorAllで返されるNodeはドキュメントに現れた順番に並んでいるのだろうか？
    const m1Values = Array.from(base.querySelectorAll(".m1"))
        .map(el => parseInt(el.value));
    const m2Values = Array.from(base.querySelectorAll(".m2"))
        .map(el => parseInt(el.value));
    const operation = Array.from(base.querySelectorAll(".operation"))
        .filter(el => el.checked)
        .map(el => el.value);
    
    if (m1Values.concat(m2Values).every(v => !isNaN(v))) {
        return calc({operation, m1Values, m2Values});
    } else {
        return NaN;
    }
};

const addListener = () => {
    const inputs = document.querySelector(".inputs");
    
    inputs.addEventListener("change", event => {
        if (event.target.classList.contains("matrixvalue")) {
            event.stopPropagation();
            const v = doCalc(inputs);
            output(v);
        }
    });
    
    inputs.addEventListener("click", event => {
        if (event.target.classList.contains("operation")) {
            event.stopPropagation();
            const v = doCalc(inputs);
            output(v);
        }
    })
};

const main = () => {
    op.test.runTest();
    addListener();
};

window.addEventListener("DOMContentLoaded", main);
window.addEventListener("unhandledrejection", err => console.error(err));

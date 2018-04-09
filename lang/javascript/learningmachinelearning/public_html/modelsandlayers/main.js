import ml from "./modelsandlayers.js";

const createFormula = (base = document) => {
    const {a, b, c} = {
        a: parseFloat(base.querySelector(".scalar-a").value),
        b: parseFloat(base.querySelector(".scalar-b").value),
        c: parseFloat(base.querySelector(".scalar-c").value)
    };
    if (Object.values({a, b, c}).every(v => !isNaN(v))) {
        const formula = new ml.Formula({a, b, c});
        return formula;
    } else {
        throw new TypeError(`Invalid parameter: a=${a},b=${b},c=${c}`);
    }
};

const displayResult = async ({base = document, result}) => {
    const resultArea = base.querySelector(".result");
    resultArea.innerHTML = await result.data();
};

const getX = (base = document) => {
    const x = base.querySelector(".xvalue").value;
    return parseFloat(x);
};

const addListener = async () => {
    const inputs = document.querySelector(".inputs");
    const outputs = document.querySelector(".outputs");

    //initial result display
    let formula = createFormula(inputs);
    let x = getX(inputs);
    await displayResult({base: outputs, result: formula.predict(x)});

    inputs.addEventListener("change", async event => {
        if (event.target.classList.contains("eventtarget")) {
            event.stopPropagation();
            if (event.target.classList.contains("scalar")) {
                formula = createFormula(inputs);
            } else if (event.target.classList.contains("xvalue")) {
                x = getX(inputs);
            }
            await displayResult({base: outputs, result: formula.predict(x)});
        }
    });
};

const main = () => {
    ml.test.runTest();
    addListener();
};

window.addEventListener("DOMContentLoaded", main);
window.addEventListener("unhandledrejection", err => console.error(err));

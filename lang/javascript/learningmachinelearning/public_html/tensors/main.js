import mt from "./tensors.js";

const doTransform = async ({context, tensor}) => {
    await mt.transform({context, tensor});
};

const testTransform = async () => {
    const canvas = document.createElement("canvas");
    const tensor = tf.tensor2d([[1, 2, 3], [4, 5, 6]]);
    const context = canvas.getContext("2d");
    await doTransform({context, tensor});
};

const drawRect = context => {
    context.fillStyle = "green";
    context.fillRect(0, 0, 50, 50);
};

const draw = async ({context, width, height, values}) => {
    context.clearRect(0, 0, width, height);
    context.save();
    const tensor = tf.tensor2d(values);
    await mt.transform({context, tensor});
    drawRect(context);
    context.restore();
};

const addListener = () => {
    const canvas = document.querySelector(".samplecanvas");
    const context = canvas.getContext("2d");
    const ctrl = document.querySelector(".control");
    ctrl.addEventListener("change", async event => {
        if (event.target.classList.contains("matrixelement")) {
            event.stopPropagation();
            const a1 = [
                ctrl.querySelector(".m11").value,
                ctrl.querySelector(".m12").value,
                ctrl.querySelector(".m21").value
            ];
            const a2 = [
                ctrl.querySelector(".m22").value,
                ctrl.querySelector(".dx").value,
                ctrl.querySelector(".dy").value
            ];
            if (a1.concat(a2).map(v => parseInt(v)).every(n => !isNaN(n))) {
                await draw({
                    context, 
                    width: canvas.width, 
                    height: canvas.height, 
                    values: [a1, a2]
                });
            }
        }
    });
};

const drawInitialRect = () => {
    const context = document.querySelector(".samplecanvas").getContext("2d");
    drawRect(context);
};

const main = async () => {
    //mt.test.runTest();
    //await testTransform();
    addListener();
    drawInitialRect();
};

window.addEventListener("DOMContentLoaded", main);

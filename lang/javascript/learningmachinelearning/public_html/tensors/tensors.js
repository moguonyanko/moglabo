/**
 * @fileOverview TensorFlow.jsから得たテンソルでCanvasの座標空間を変換するモジュール
 */

const transform = async ({context, tensor}) => {
    const [a, b, c, d, e, f] = await tensor.data();
    context.transform(a, b, c, d, e, f);
};

const runTest = async () => {
    const matrix = tf.tensor2d([[10, 20, 30], [40, 50, 60], [0, 0, 1]]);
    matrix.print();
    console.log(await matrix.data());
};

const myTransformation = {
    transform,
    test: {
        runTest
    }
};

export default myTransformation;

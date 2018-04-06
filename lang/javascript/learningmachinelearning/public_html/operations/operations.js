/**
 * @fileOverview TensorFlow.jsで行列計算を行う練習のためのモジュール
 * 
 * ブラウザによって計算結果の精度が異なっている。
 */

const square = tensor => tensor.square();
const add = ({t1, t2}) => t1.add(t2);
const sub = ({t1, t2}) => t1.sub(t2);
const mul = ({t1, t2}) => t1.mul(t2);
const div = ({t1, t2}) => t1.div(t2);

const runTest = () => {
    const t1 = tf.tensor2d([[1, 3], [2, 4]]);
    square(t1).print();
    const t2 = tf.ones([2, 2]);
    add({t1, t2}).print();
    sub({t1, t2}).print();
    mul({t1, t2}).print();
    div({t1, t2}).print();
};

const myOperations = {
    add, sub, mul, div, square,
    test: {
        runTest
    }
};

export default myOperations;

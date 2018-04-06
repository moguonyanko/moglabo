/**
 * @fileOverview TensorFlow.jsのVariablesを調査するためのモジュール
 * 
 * DOM層
 * CustomElements層
 * ECMA層(ここ)
 * 
 * @deprecated 
 * 正確にはTensorFlow.js内部でWebGLが使用されているので
 * このスクリプトはECMAScriptのみでは完結していない。
 * 実際のところTensorFlowの関数をそのまま呼び出しているだけなので
 * このスクリプトは使用しない。
 */

const createVariable = ({tensor}) => tf.variable(tensor);

// tf.Variable.assignは値を返さない。
const assignVariable = ({targetValue, newValue}) => targetValue.assign(newValue);

const runTest = () => {
    const tensor = tf.zeros([3, 3]);
    const v1 = createVariable({tensor});
    v1.print();
    const baseMatrix = tf.tensor2d([[1, 0, 0], [1, 0, 0], [0, 0, 1]]);
    const v2 = createVariable({tensor: baseMatrix});
    assignVariable({
        targetValue: v1,
        newValue: v2
    });
    v1.print();
};

const myVariables = {
    createVariable,
    assignVariable,
    test: {
        runTest
    }
};

export default myVariables;

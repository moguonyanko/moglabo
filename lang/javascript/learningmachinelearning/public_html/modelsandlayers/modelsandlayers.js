/**
 * @fileOverview TensorFlow.jsでモデルを生成する調査のためのモジュール
 */

class Formula {
    // y = a*x^2 + b*x + c
    // a, b, c はscalar
    constructor( {a, b, c}) {
        Object.assign(this, {
            a: tf.scalar(a),
            b: tf.scalar(b),
            c: tf.scalar(c)
        });
    }

    predict(input) {
        return tf.tidy(() => {
            const x = tf.scalar(input);
            const ax2 = this.a.mul(x.square());
            const b = this.b.mul(x);
            const y = ax2.add(b).add(this.c);
            return y;
        });
    }
}

class LayerConfig {
    constructor( {units, activation}) {
        Object.assign(this, {units, activation});
    }

    get layer() {
        return tf.layers.dense({units: this.units, activation: this.activation});
    }
}

/**
 * 具体的に何を行なっているのかは理解できていない。
 * 
 * 参考:
 * https://js.tensorflow.org/api/latest/index.html#model
 */
class Model {
    constructor( {inputShape, layerConfigs = []}) {
        Object.assign(this, {inputShape, layerConfigs});
    }

    predict(inputData) {
        // モデルの入力層を生成している？
        const inputs = tf.input({shape: this.inputShape});

        // 隠れ層を相互に適用して出力層を生成している？
        const outputs = this.layerConfigs
            .map(config => config.layer)
            .reduce((accTensor, layer) => layer.apply(accTensor), inputs);

        // 入力層と出力層を元にモデルを生成する。
        const model = tf.model({inputs, outputs});

        // 入力データのテンソルをモデルに与えて評価結果を返す。
        return model.predict(inputData);
    }
}

const testFormula = () => {
    const a = 2,
        b = 4,
        c = 8;

    const f = new Formula({a, b, c});

    const y = f.predict(2);

    y.print();
};

const testModel = () => {
    const layerConfig1 = new LayerConfig({units: 10, activation: "relu"}),
        layerConfig2 = new LayerConfig({units: 2, activation: "softmax"});
        
    const model = new Model({
        inputShape: [5],
        layerConfigs: [layerConfig1, layerConfig2]
    });
    
    const result = model.predict(tf.ones([2, 5]));
    
    result.print();
};

const runTest = () => {
    //testFormula();
    testModel();
};

const myModels = {
    Formula,
    LayerConfig,
    Model,
    test: {
        runTest
    }
};

export default myModels;

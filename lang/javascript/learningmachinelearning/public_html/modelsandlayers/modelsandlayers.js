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

const runTest = () => {
    const a = 2,
        b = 4,
        c = 8;

    const f = new Formula({a, b, c});

    const y = f.predict(2);

    y.print();
};

const myModels = {
    Formula,
    test: {
        runTest
    }
};

export default myModels;

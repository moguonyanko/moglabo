/**
 * @fileOverview Get Started
 * @see https://js.tensorflow.org/#getting-started
 */
// tfjs.jsにてグローバルオブジェクトtfが宣言済みなのでimportは不要。
//import * as tf from '@tensorflow/tfjs';

// Define a model for linear regression.
const model = tf.sequential(),
    units = 1,
    inputShape = [1];
model.add(tf.layers.dense({units, inputShape}));

// Prepare the model for training: Specify the loss and the optimizer.
const loss = "meanSquaredError",
    optimizer = "sgd";
model.compile({loss, optimizer});

// Generate some synthetic data for training.
const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

// Train the model using the data.
(async () => {
    await model.fit(xs, ys);
    // Use the model to do inference on a data point the model hasn't seen before:
    model.predict(tf.tensor2d([5], [1, 1])).print();
})();

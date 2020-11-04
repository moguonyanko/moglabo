import random from './random.js';

self.addEventListener('message', event => {
  const { data } = event;
  Atomics.store(data, 0, random.getRandomInteger(100));
  const number = Atomics.notify(data, 0, 1);
  console.info(`${number}つのエージェントに通知:${new Date().toString()}`);
});

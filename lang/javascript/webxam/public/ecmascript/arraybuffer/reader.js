self.addEventListener('message', event => {
  const { data } = event;
  const status = Atomics.wait(data, 0, 0);
  console.info(`再開${status}:${new Date().toString()}`);
  const result = Atomics.load(data, 0);
  self.postMessage(result);
});

self.addEventListener('message', async event => {
  const { data } = event;
  // Atomics.waitAsyncはブロックすることが許容されないブラウザの
  // メインスレッドで使用されるのが効果的である。
  const status = await (Atomics.waitAsync(data, 0, 0)).value;
  //const status = Atomics.wait(data, 0, 0);
  console.info(`再開${status}:${new Date().toString()}`);
  const result = Atomics.load(data, 0);
  self.postMessage(result);
});

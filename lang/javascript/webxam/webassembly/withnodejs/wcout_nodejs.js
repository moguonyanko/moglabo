/**
 * @todo wasmを読み込んでもWebAssembly.instantiateでエラーになってしまう。
 */

// eslint-disable-next-line no-undef
const fs = require('fs');

const instantiateWebAssembly = async bytes => {
  const importObject = {
    env: {
      __memory_base: 0
    }
  };   
  const result = await WebAssembly.instantiate(bytes, importObject);
  return result.instance.exports;
};

const readFile = path => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, async (error, bytes) => {
      if (error) {
        reject(error);
      } else {
        resolve(bytes);
      }
    });
  });
};

const init = async () => {
  const bytes = await readFile('wcout.wasm');
  const module = await instantiateWebAssembly(bytes);
  module.printMultibyteChars();
};

init().then();

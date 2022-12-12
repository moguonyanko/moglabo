/**
 * @fileoverview Node.jsとEmscriptenを組み合わせるサンプルスクリプト
 * 参考:
 * 「ハンズオンWebAssembly」P.446〜
 */

// eslint-disable-next-line no-undef
const fs = require('fs');

const unitTests = {
  'increment関数で引数を1加算できる': module => {
    const expected = 3;
    console.log(module.increment(2) === expected);
  }
};

const instantiateWebAssembly = async bytes => {
  const importObject = {
    env: {
      __memory_base: 0
    }
  }; 
  
  // WebAssembly.instantiateStreamingはNode.jsでサポートされていない。
  const result = await WebAssembly.instantiate(bytes, importObject);
  return result.instance.exports;
};

// wasmはfetchではなくreadFileで読み込む必要がある。
fs.readFile('side_module.wasm', async (error, bytes) => {
  if (error) throw error;

  const module = await instantiateWebAssembly(bytes);
  Object.values(unitTests).forEach(testCase => testCase(module));
});

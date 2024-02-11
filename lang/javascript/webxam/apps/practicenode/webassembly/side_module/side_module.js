/**
 * @fileoverview WebAssemblyモジュール読み込みテストを行うためのスクリプト
 * 参考:
 * 「ハンズオンWebAssembly」P.105
 */
/* eslint-env node */

const importObject = {
  env: {
    __memory_base: 0
  }
};

const isSupportedWebAssemblyJavaScriptAPI = () => {
  if (typeof WebAssembly !== 'object') {
    return false;
  }
  try {
    // 最小限のWebAssemblyモジュールがコンパイルできるかどうかをテストする。
    const module = new WebAssembly.Module(new Uint8Array([0x00, 0x61, 0x73, 0x6D,
      0x01, 0x00, 0x00, 0x00]));
    if (module instanceof WebAssembly.Module) {
      const moduleInstance = new WebAssembly.Instance(module);
      return (moduleInstance instanceof WebAssembly.Instance);
    }
  } catch (err) {
    console.err(err.message);
    return false;
  }
};

let currentValue = 0;
let loadedModule = null;

const updateValue = (value = 0) => {
  currentValue = value;
};

const main = async () => {
  if (!isSupportedWebAssemblyJavaScriptAPI()) {
    const errMessage = 'WebAssembly JavaScript APIが使用できません';
    throw new Error(errMessage);
  }
  // WebAssembly.instantiateStreamingは実装されているものとする。
  // 実装されていない場合はWebAssembly.instantiateを使う。
  try {
    // TODO: wasmが正常に読み込めず左辺値がnullになってしまう。
    loadedModule = await WebAssembly.instantiate(require('./side_module'),
      importObject);
  } catch (err) {
    throw new Error(`モジュール読み込み失敗:${err.message}`)
  }
  updateValue();
};

main().then().catch(err => {
  console.error(err.message)
})

class SideModule {
  static increment() {
    loadedModule.instance.exports.increment(currentValue)
  }
}

module.exports = SideModule

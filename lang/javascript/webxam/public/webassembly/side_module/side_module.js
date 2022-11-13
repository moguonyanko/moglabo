/**
 * @fileoverview WebAssemblyモジュール読み込みテストを行うためのスクリプト
 * 参考:
 * 「ハンズオンWebAssembly」P.105
 */

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

const addListener = () => {
  const main = document.querySelector('main');
  main.addEventListener('click', event => {
    const { eventTarget } = event.target.dataset;

    if (eventTarget === 'incrementValue') {
      const newValue = loadedModule.instance.exports.increment(currentValue);
      currentValue = newValue;    
      const output = document.querySelector('.output');
      output.textContent = currentValue;
    }
  });
};

const main = async () => {
  if (!isSupportedWebAssemblyJavaScriptAPI()) {
    const errMessage = 'WebAssembly JavaScript APIが使用できません';
    return Promise.reject(errMessage);
  }
  // WebAssembly.instantiateStreamingは実装されているものとする。
  // 実装されていない場合はWebAssembly.instantiateを使う。
  loadedModule = await WebAssembly.instantiateStreaming(fetch('side_module.wasm'), importObject);
  addListener();
};

main().then().catch(msg => alert(msg));

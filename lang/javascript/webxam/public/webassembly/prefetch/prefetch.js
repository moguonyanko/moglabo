/**
 * @fileoverview WebAssemlbyによるプリフェッチ調査用スクリプト
 * 参考:
 * 「ハンズオンWebAssembly」P.387〜
 */

let compileModule = null;
let emscriptenModule = null;

const onInstantiateWasm = async (importObject, successCallback) => {
  const result = await WebAssembly.instantiate(compileModule, importObject);
  successCallback(result);
  // 何も返さなくても正常に動作する。
  //return {};
};

const init = () => {
  const worker = new Worker('prefetch_worker.js');
  worker.addEventListener('message', async event => {
    compileModule = event.data;
    // eslint-disable-next-line no-undef
    emscriptenModule = await Module({ instantiateWasm: onInstantiateWasm });
  });
};

init();

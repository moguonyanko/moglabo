/**
 * @fileoverview プリフェッチ調査用スクリプトから使用されるWebWorker
 * 参考:
 * 「ハンズオンWebAssembly」P.395〜
 */

WebAssembly.compileStreaming(fetch('calculate_primes.wasm'))
  .then(module => {
    self.postMessage(module);
  });

/**
 * @fileoverview WebAssembly JavaScript APIによる動的リンク調査用スクリプト
 * 参考:
 * 「ハンズオンWebAssembly」P.304〜
 */

const START = 3, END = 100;

const output = document.querySelector('.output');

const logPrime = prime => {
  output.innerHTML += `${prime.toString()}<br />`;
};

const isPrimeImportObject = {
  // Does nothing
};

const init = async () => {
  const isPrimeModule = await WebAssembly.instantiateStreaming(fetch('is_prime.wasm'), 
    isPrimeImportObject);

  const findPrimesImportObject = {
    env: {
      isPrime: isPrimeModule.instance.exports.isPrime,
      logPrime
    }
  };

  const findPrimesModule = await WebAssembly.instantiateStreaming(fetch('find_primes.wasm'),
    findPrimesImportObject);

  findPrimesModule.instance.exports.findPrimes(START, END);  
};

init().then();

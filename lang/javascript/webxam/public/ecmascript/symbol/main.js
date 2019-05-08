/**
 * @fileOverview Symbol調査用スクリプト
 */

class HelloIterator {
  * [Symbol.iterator] () {
    yield 'H';
    yield 'E';
    yield 'L';
    yield 'L';
    yield 'O';
  }
}

// DOM

const runHelloIterator = () => {
  const hi = new HelloIterator;
  const output = document.querySelector('.example.iterator .output');
  output.innerHTML = [...hi].join('');
};

window.addEventListener('DOMContentLoaded', () => {
  runHelloIterator();
});

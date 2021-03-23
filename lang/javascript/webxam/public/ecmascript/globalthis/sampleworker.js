/* eslint-disable no-undef */

self.addEventListener('message', event => {
  console.log(`${event.data} -> `);
  console.log(self);
  console.log('Worker this -> ');
  console.log(this);
  console.log('Worker globalThis -> ');
  console.log(globalThis);
  self.postMessage('Check listener this');
});
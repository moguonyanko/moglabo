class Foo {}

Foo.prototype.getThis = () => {
  return this;
};

Foo.prototype.getThisFunc = function() {
  return this;
};

class Bar {
  getThis() {
    return this;
  }
}

const tests = {
  'window === globalThis': () => window === globalThis,
  'this === globalThis': () => this === globalThis,
  'new Foo().getThis() === globalThis': () => {
    return new Foo().getThis() === globalThis;
  },
  'new Foo().getThisFunc() === globalThis': () => {
    return new Foo().getThisFunc() === globalThis;
  },
  'new Bar().getThis() === globalThis': () => {
    return new Bar().getThis() === globalThis;
  }
};

const runTest = () => {
  console.log(globalThis);
};

// DOM

const dumpThisInfo = () => {
  let resultArea = document.querySelector('.resultarea');
  Object.keys(tests).forEach(testName => {
    resultArea.value += `${testName}: ${tests[testName]()}\n`;
  })
};

const init = () => {
  runTest();
  dumpThisInfo();
};

window.addEventListener('DOMContentLoaded', init);

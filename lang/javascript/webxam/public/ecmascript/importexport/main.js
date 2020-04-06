/**
 * @fileoverview import調査用スクリプト
 */

const dynamicImport = async () => {
  const path = './mod.js';
  const { default: MyMod } = await import(path);
  return MyMod;
};

const runTest = async () => {
  const Mod = await dynamicImport();
  const m = new Mod('AbcDef');
  console.log(m.toUpper());
  console.log(m.toLower());
};

//runTest().then();

const funcs = {
  async dynamicImport() {
    const MyModule = await dynamicImport();
    const mod = new MyModule(document.getElementById('sampletext').value);
    const u = mod.toUpper(), l = mod.toLower();
    const result = document.querySelector('.dynamicimport .result');
    result.value += `${u}\t${l}\n`;
  }
};

const init = () => {
  const main = document.querySelector('main');
  main.addEventListener('click', async event => {
    const t = event.target.dataset.eventTarget;
    if (typeof funcs[t] === 'function') {
      event.stopPropagation();
      await funcs[t]();
    }
  });
};

init();
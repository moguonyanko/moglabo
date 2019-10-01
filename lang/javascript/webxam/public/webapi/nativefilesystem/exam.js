/**
 * @fileoverview Native File System API調査用スクリプト
 */

const funcs = {
  async chooseFile() {
    // ユーザーの操作を経由して呼び出されなければエラーになる。
    const entries = await window.chooseFileSystemEntries({
      multiple: true
    });
    return entries;
  }
};

// DOM

const outputs = {
  chooseFile(result) {
    const output = document.querySelector('.output.chooseFile');
    const ps = result.map(r => r.getFile());
    Promise.all(ps).then(files => {
      output.innerHTML = files.map(f => f.name).join('<br />');
    });
  }
};

const addListener = () => {
  const main = document.querySelector('main');
  main.addEventListener('pointerup', async event => {
    const t = event.target.dataset.eventTarget;
    if (!t) return;
    if (typeof funcs[t] === 'function') {
      event.stopPropagation();
      const result = await funcs[t]();
      outputs[t](result);
    }
  });
};

const init = () => {
  addListener();
};

window.addEventListener('DOMContentLoaded', init);

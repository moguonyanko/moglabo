/**
 * @fileoverview Native File System API調査用スクリプト
 */

// TODO:
// 読んだ値を配列に溜め込むのではStreamとReaderを使う意味が無い。
// Generatorで上手くやれないか？
const decoders = {
  async text(reader) {
    const results = [],
      decoder = new TextDecoder('UTF-8');
    for (; ;) {
      // ユーザーの操作を介さずにreadを呼び出されるとエラーになる。
      const { done, value } = await reader.read();
      if (!done) {
        results.push(decoder.decode(value));
      } else {
        break;
      }
    }
    return results.join('');
  },
  async image(reader, type) {
    const results = [];
    for (; ;) {
      const { done, value } = await reader.read();
      if (!done) {
        results.push(value);
      } else {
        break;
      }
    }
    const blob = new Blob(results, { type });
    return blob;
  }
};

const funcs = {
  async chooseFile() {
    // ユーザーの操作を経由して呼び出されなければエラーになる。
    const entries = await window.chooseFileSystemEntries({
      multiple: true
    });
    return entries;
  },
  async readFile() {
    const fileHandle = await window.chooseFileSystemEntries();
    const file = await fileHandle.getFile();
    const stream = await file.stream();
    const reader = stream.getReader();

    const t = file.type.split('/')[0];
    const decoder = decoders[t];
    if (typeof decoder === 'function') {
      return await decoder(reader, file.type);
    } else {
      return [];
    }
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
  },
  async readFile(result) {
    const output = document.querySelector('.output.readFile'),
      ctx = output.getContext('2d'),
      style = getComputedStyle(output),
      [w, h] = [
        parseInt(style.getPropertyValue('width')),
        parseInt(style.getPropertyValue('height'))
      ];
    output.width = w;
    output.height = h;
    ctx.clearRect(0, 0, w, h);
    if (result instanceof Blob) {
      const offscreen = new OffscreenCanvas(w, h);
      const offctx = offscreen.getContext('bitmaprenderer');
      const bitmap = await createImageBitmap(result);
      offctx.transferFromImageBitmap(bitmap);
      ctx.drawImage(offscreen, 0, 0, w, h);
    } else {
      ctx.font = '24px monospace';
      ctx.textBaseline = 'middle';
      ctx.fillText(result, 0, h / 2);
    }
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
      await outputs[t](result);
    }
  });
};

const init = () => {
  addListener();
};

window.addEventListener('DOMContentLoaded', init);

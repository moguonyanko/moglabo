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

const createNewFileHandle = async ({ extension, mimeType }) => {
  const options = {
    type: 'saveFile',
    accepts: [{
      description: 'sample new file',
      extensions: [extension],
      mimeTypes: [mimeType]
    }]
  };
  return await window.chooseFileSystemEntries(options);
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
  },
  async saveImage({ extension, mimeType, image }) {
    const fileHandle = await createNewFileHandle({
      extension, mimeType
    });
    const writer = await fileHandle.createWriter();
    await writer.truncate(0);
    // 新規作成時は読み取り権限が設定されていないため
    // 作成後にブラウザからアクセスした際に403エラーとなる。
    await writer.write(0, image);
    await writer.close();
  },
  async getFileList() {
    const handle = await window.chooseFileSystemEntries({
      type: 'openDirectory'
    });
    const rootEntries = await handle.getEntries();
    const f = async (entries, acc) => {
      for await (const entry of entries) {
        const name = entry.name;
        if (entry.isFile) {
          acc[name] = name;
        } else {
          acc[name] = {};
          const ents = await entry.getEntries();
          await f(ents, acc[name]);
        }
      }
    };
    const result = {};
    await f(rootEntries, result);
    return result;
  }
};

// DOM

const inits = {
  saveImage() {
    const canvas = document.querySelector('canvas.saveImage');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    const [x, y, w, h] = [
      canvas.width / 4,
      canvas.height / 4,
      canvas.width / 2,
      canvas.height / 2
    ];
    ctx.fillRect(x, y, w, h);
  }
};

const getArgs = {
  saveImage() {
    const canvas = document.querySelector('canvas.saveImage');
    return new Promise(resolve => {
      canvas.toBlob(blob => {
        resolve({
          extension: 'png',
          mimeType: 'image/png',
          image: blob
        });
      });
    });
  }
};

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
  },
  saveImage(result) {
    const output = document.querySelector('.output.saveImage');
    if (result instanceof Error) {
      output.textContent = result.message;
      return;
    }
    const img = new Image();
    img.onload = () => {
      output.querySelector('img') && output.querySelector('img').remove();
      output.appendChild(img);
    };
    img.src = 'sample.png';
  },
  getFileList(result) {
    const output = document.querySelector('.output.getFileList');
    output.textContent = JSON.stringify(result);
  }
};

const addListener = () => {
  const main = document.querySelector('main');
  main.addEventListener('pointerup', async event => {
    const t = event.target.dataset.eventTarget;
    if (!t) return;
    if (typeof funcs[t] === 'function') {
      event.stopPropagation();
      try {
        const args = typeof getArgs[t] === 'function' &&
          await getArgs[t]();
        const result = await funcs[t](args);
        await outputs[t](result);
      } catch (err) {
        await outputs[t](err);
      }
    }
  });
};

const initAll = () => {
  Object.values(inits).forEach(init => init());
};

const init = () => {
  initAll();
  addListener();
};

window.addEventListener('DOMContentLoaded', init);

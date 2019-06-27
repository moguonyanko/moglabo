/**
 * @fileoverview Clipboard API調査用スクリプト
 * ここで扱うAPIは主にAsynchronous Clipboard APIの方である。
 */

// DOM

const clipboard = {
  read: 'clipboard-read',
  write: 'clipboard-write'
};

const permit = async name => {
  const { state } = await navigator.permissions.query({ name });
  switch (state) {
    case 'granted':
    case 'prompt':
      return true;
    default:
      return false;
  }
};

const outputError = ({ root, error }) => {
  root.querySelector('.output').innerHTML +=
    `<span class="error">${error.message}<span><br />`;
};

const clearOutput = root => {
  root.querySelector('.output').innerHTML = '';
};

const clipTextListeners = {
  async [clipboard.read](root) {
    const output = root.querySelector('.output');
    try {
      const text = await navigator.clipboard.readText();
      output.innerHTML += `${text}<br />`
    } catch (error) {
      outputError({ output, error });
    }
  },
  async [clipboard.write](root) {
    const output = root.querySelector('.output');
    try {
      const text = root.querySelector('.sample-text').value;
      await navigator.clipboard.writeText(text);
    } catch (error) {
      outputError({ output, error });
    }
  },
  clearOutput
};

const imageToBlob = async ({ image, type, quality, size }) => {
  const {width, height} = size;
  try {
    // OffscreenCanvasコンストラクタの引数は必須。
    const canvas = new OffscreenCanvas(width, height);
    canvas.getContext('2d').drawImage(image, 0, 0, width, height);
    return await canvas.convertToBlob({ type, quality });
  } catch(err) { // for Firefox
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(image, 0, 0, width, height);
    return new Promise((resolve) => {
      canvas.toBlob(resolve, type, quality);
    });
  }
};

const createImage = blob => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = err => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
};

const getSelectedImageType = root => {
  const selectableTypes = root.querySelectorAll(`input[name='imagetype']`);
  const eles = Array.from(selectableTypes).filter(el => el.checked);
  return eles[0] ? eles[0].value : 'image/png';
};

const clipImageListeners = {
  async [clipboard.read](root) {
    const output = root.querySelector('.output');
    try {
      const items = await navigator.clipboard.read();
      const blob = await items[0].getType(getSelectedImageType(root));
      const img = await createImage(blob);
      output.appendChild(img);
    } catch (error) {
      outputError({ root, error });
    }
  },
  async [clipboard.write](root) {
    const type = getSelectedImageType(root);
    try {
      const image = root.querySelector('.sample-image');
      const blob = await imageToBlob({ 
        image, 
        type, 
        quality: 1,
        size: image 
      });
      // ClipboardItemがESLintで認識されるようになったら以下の行は削除する。
      // eslint-disable-next-line no-undef
      const item = new ClipboardItem({
        [type]: blob
      });
      await navigator.clipboard.write([item]);
    } catch (error) {
      outputError({ root, error });
    }
  },
  clearOutput
};

const listeners = {
  clipText: clipTextListeners,
  clipImage: clipImageListeners
};

const init = () => {
  document.querySelectorAll('.example').forEach(root => {
    root.addEventListener('pointerup', async event => {
      const ct = event.currentTarget.dataset.eventTarget;
      if (!ct) {
        return;
      }
      const et = event.target.dataset.eventTarget,
        listener = listeners[ct];
      if (typeof listener[et] !== 'function') {
        return;
      }
      if (et in clipboard && !(await permit(et))) {
        outputError({ root, error: new Error(`Not permitted: ${et}`) });
        return;
      }
      event.stopPropagation();
      await listener[et](root);
    });
  });
};

window.addEventListener('DOMContentLoaded', init);

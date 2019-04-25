/**
 * @fileOverview Canvas調査用スクリプト
 */

const loadTestBlob = async () => {
  const response = await fetch('/webxam/service/loadTestImage');
  if (response.ok) {
    return await response.blob();
  } else {
    throw new Error(`Cannot load image: ${response.statusText}`);
  }
};

const toBitmapImage = image => {
  const offscreen = new OffscreenCanvas(image.width, image.height);
  const context = offscreen.getContext('2d');
  context.drawImage(image, 0, 0);
  const bitmap = offscreen.transferToImageBitmap();
  return bitmap;
};

// DOM

const listeners = {
  /**
   * OffscreenCanvasやサーバリクエストは全く不要だが振る舞いの調査のため行っている。
   */
  async drawTestImage(root) {
    try {
      const blob = await loadTestBlob();
      const url = URL.createObjectURL(blob);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(url);
        const bitmap = toBitmapImage(image);
        const canvas = root.querySelector('.output');
        canvas.getContext('bitmaprenderer').transferFromImageBitmap(bitmap);
      };
      image.src = url;
    } catch (err) {
      alert(err.message);
      throw err;
    }
  },
  async convertToBlob(root) {
    const canvas = new OffscreenCanvas(300, 300);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.fillRect(canvas.width / 2, canvas.height / 2, 100, 80);
    const blob = await canvas.convertToBlob();
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const output = root.querySelector('.output');
      output.innerHTML = '';
      output.appendChild(img);
    };
    img.src = url;
  }
};

const inits = {
};

const addListener = () => {
  Array.from(document.querySelectorAll('.example')).forEach(el => {
    el.addEventListener('pointerup', async event => {
      const root = event.target.dataset.eventTarget;
      if (root) {
        event.stopPropagation();
        await listeners[root](el);
      }
    });
  });
};

window.addEventListener('DOMContentLoaded', () => {
  addListener();
  Object.values(inits).forEach(f => f());
});
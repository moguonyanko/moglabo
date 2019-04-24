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
        const canvas = root.querySelector('canvas.output');
        canvas.getContext('bitmaprenderer').transferFromImageBitmap(bitmap);
      };
      image.src = url;
    } catch (err) {
      alert(err.message);
      throw err;
    }
  }
};

const addListener = () => {
  Array.from(document.querySelectorAll('section.example')).forEach(el => {
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
});
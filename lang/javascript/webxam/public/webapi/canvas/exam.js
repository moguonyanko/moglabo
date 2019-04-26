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

const getRandomRGB = () => {
  return [
    parseInt(Math.random() * 255), 
    parseInt(Math.random() * 255), 
    parseInt(Math.random() * 255)
  ];
};

const getRandomRGBA = () => {
  const values = getRandomRGB();
  values.push(Math.random());
  return values;
};

// DOM

const blobToImage = blob => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
};

let drawWorkers = [], 
    drawingOffscreen;

const listeners = {
  /**
   * OffscreenCanvasやサーバリクエストは全く不要だが振る舞いの調査のため行っている。
   */
  async transferToImageBitmap(root) {
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
  },
  transferControlToOffscreen(root) {
    if (!drawingOffscreen) {
      const canvasElement = root.querySelector('.output');
      const style = getComputedStyle(canvasElement);
      // canvas要素のサイズを設定しないと描画された図形が意図したサイズと異なってしまう。
      canvasElement.width = parseInt(style.getPropertyValue('width'));
      canvasElement.height = parseInt(style.getPropertyValue('height'));
      drawingOffscreen = canvasElement.transferControlToOffscreen();
    }
    if (drawWorkers.length === 0) {
      const workerSize = parseInt(root.querySelector('.workersize').value);
      drawWorkers = new Array(workerSize)
          .fill(new Worker('drawworker.js'))
          .map(worker => {
        worker.postMessage({
          canvas: drawingOffscreen,
          fillStyle: `rgba(${getRandomRGBA().join(',')})`
        }, [drawingOffscreen]);
        return worker;
      });
    }
// messageをWorkerから受け取らなくてもWorkerの変更はcanvasに反映される。    
//    worker.onmessage = async event => {
//      // OffscreenCanvasにtoBlobは存在しない。
//      //const blob = offscreen.toBlob();
//    };
  },
  stopControlToOffscreen(root) {
    if (drawWorkers.length > 0) {
      drawWorkers.forEach(worker => worker.terminate());
      drawWorkers = [];
      drawingOffscreen = null;
      // 同じcanvasに対しては1回しかtransferControlToOffscreenできないので
      // 新しいcanvasに差し替える。
      const oldCanvas = root.querySelector('.output'),
          newCanvas = oldCanvas.cloneNode(true);
      oldCanvas.parentNode.replaceChild(newCanvas, oldCanvas);
    }
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
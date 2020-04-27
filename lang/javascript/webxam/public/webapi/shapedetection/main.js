/**
 * @fileoverview Shape Detection API調査用スクリプト
 * 参考:
 * https://shape-detection-demo.glitch.me/
 * https://jameshfisher.com/2020/03/01/how-to-write-an-arraybuffer-to-a-canvas/
 */

const getImageBitmap = ({ url }) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const [w, h] = [img.naturalWidth, img.naturalHeight];
      const canvas = new OffscreenCanvas(w, h);
      const g = canvas.getContext('2d');
      g.drawImage(img, 0, 0, w, h);
      const bitmap = canvas.transferToImageBitmap();
      resolve(bitmap);
    };
    img.onerror = reject;
  });
};

// eslint-disable-next-line no-unused-vars
const getArrayBuffer = blob => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader(blob);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
};

// eslint-disable-next-line no-unused-vars
const getImageDataWithArrayBuffer = ({ buffer, width, height }) => {
  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext('2d');
  const pixels = new Uint8ClampedArray(buffer);
  // bufferは画像ファイルを読み込んで得られたものである。ピクセル操作は不要では？
  // for (let y = 0; y < height; y++) {
  //   for (let x = 0; x < width; x++) {
  //     const i = (y * width + x) * 4;
  //     pixels[i] = x;       // Red
  //     pixels[i + 1] = y;   // Green
  //     pixels[i + 2] = 0;   // Blue
  //     pixels[i + 3] = 255; // Alpha
  //   }
  // }
  const imageData = context.getImageData(0, 0, width, height);
  //context.putImageData(imageData);
  imageData.data.set(pixels);
  return imageData;
};

const detectData = ({ data, type }) => {
  return new Promise((resolve, reject) => {
    // detect時のパフォーマンスへの影響を軽減するためにWorkerでdetectする。
    const worker = new Worker('worker.js', { type: 'module' });
    worker.onmessage = event => resolve(event.data);
    worker.onerror = reject;
    const message = { type, target: data };
    try {
      // 第2引数にFileやBlob、ImageDataは渡すことができない。ImageBitmapは可。
      // https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage
      worker.postMessage(message, [data]);
    } catch (err) {
      console.error(err.message);
      worker.postMessage(message);
    } finally {
      // terminateするとWorkerの処理が完了する前にWorkerが停止させられてしまう。
      //worker.terminate();
    }
  });
};

// eslint-disable-next-line no-unused-vars
const runTest = async () => {
  const data = await getImageBitmap({ url: '../../image/hello.png' });
  const result = await detectData({ data, type: 'text' });

  //const data = await getImageBitmap({ url: '../../image/samplecode1.png' });
  //const result = await detectData({ data, type: 'barcode' });

  //const data = await getImageBitmap({ url: '../../image/samplefaces1.jpeg' });
  //const result = await detectData({ data, type: 'face' });

  console.log(result);
};

// DOM

const loadData = async ({ selector }) => {
  const file = document.querySelector(selector).files.item(0);
  if (!file) {
    throw new Error('Target file is not selected');
  }
  // Canvasへの描画を経由せずにFileに対してdetectしたいが上手くいっていない。
  // ただしCanvasにImageを描画してImageBitmapを得る方がシンプルである。
  // const buffer = await file.arrayBuffer();
  // const data = await getImageDataWithArrayBuffer({
  //   buffer, width: 600, height: 600
  // });
  const url = URL.createObjectURL(file);
  const data = await getImageBitmap({ url });
  URL.revokeObjectURL(url);
  return data;
};

const listeners = {
  detectText: async () => {
    const data = await loadData({ selector: '#sampleImage' });
    const result = await detectData({ data, type: 'text' });
    const output = document.querySelector('.output.textdetector');
    output.textContent = JSON.stringify(result);
  },
  detectBarcode: async () => {
    const data = await loadData({ selector: '#sampleBarcodeImage' });
    const result = await detectData({ data, type: 'barcode' });
    const output = document.querySelector('.output.barcodedetector');
    output.textContent = JSON.stringify(result);
  },
  getSupportedBarcodeFormats: async () => {
    const formats = await BarcodeDetector.getSupportedFormats();
    const output = document.querySelector('.output.barcodedetector');
    output.textContent = JSON.stringify(formats);
  },
  detectFace: async () => {
    const data = await loadData({ selector: '#sampleFaceImage' });
    const result = await detectData({ data, type: 'face' });
    const output = document.querySelector('.output.facedetector');
    output.textContent = JSON.stringify(result);
  }
};

const addListener = () => {
  document.querySelector('main').addEventListener('click',
    async event => {
      const t = event.target.dataset.eventTarget;
      if (typeof listeners[t] !== 'function') {
        return;
      }
      event.stopPropagation();
      try {
        await listeners[t]();
      } catch (e) {
        alert(e.message);
      }
    });
};

(async () => {
  await runTest();
  addListener();
})().then();

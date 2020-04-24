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

const detectText = ({ data }) => {
  return new Promise((resolve, reject) => {
    // detect時のパフォーマンスへの影響を軽減するためにWorkerでdetectする。
    const worker = new Worker('worker.js', { type: 'module' });
    worker.onmessage = event => {
      resolve(event.data[0]);
    };
    worker.onerror = reject;
    try {
      // 第2引数にFileやBlob、ImageDataは渡すことができない。ImageBitmapは可。
      // https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage
      worker.postMessage(data, [data]);
    } catch (err) {
      console.error(err.message);
      worker.postMessage(data);
    }
  });
};

const runTest = async () => {
  const data = await getImageBitmap({ url: '../../image/hello.png' });
  const result = await detectText({ data });
  console.log(result);
};

// DOM

const listeners = {
  detectText: async () => {
    const file = document.querySelector('#sampleImage').files.item(0);
    if (!file) {
      return;
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
    const result = await detectText({ data });
    const output = document.querySelector('.output.textdetector');
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
      await listeners[t]();
    });
};

const main = () => {
  //runTest().then();
  addListener();
};

main();

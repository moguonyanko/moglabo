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
  values.push(Math.random().toFixed(1));
  return values;
};

// BlobURLを引数に取ることでもWorkerを生成することはできる。
const createDrawWorkerURL = async () => {
  const response = await fetch(`drawworker.js`);
  if (response.ok) {
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } else {
    throw new Error(`Cannot create worker: ${response.statusText}`);
  }
};

const getBlobByCanvas = ({ url, type, quality, crossOrigin }) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    if (crossOrigin) {
      img.crossOrigin = crossOrigin;
    }

    img.onload = () => {
      const canvas = new OffscreenCanvas(img.width, img.height);
      const context = canvas.getContext('2d');
      context.drawImage(img, 0, 0);
      // OffscreenCanvasの場合はtoBlobではなくconvertToBlobである。
      // 後続の処理でImageBitmapにするならtransferToImageBitmapでよいが
      // ここではBlobに変換した際の挙動を調査したいのでconvertToBlobを呼び出す。
      canvas.convertToBlob({
        type,
        quality
      })
        .then(resolve)
        .catch(reject);
    };
    img.onerror = reject;
    img.src = url;
  });
};

// eslint-disable-next-line no-unused-vars
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

const drawBlob = async ({ blob, canvas }) => {
  const context = canvas.getContext('2d');
  const bitmap = await createImageBitmap(blob);
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  context.drawImage(bitmap, 0, 0);
  bitmap.close();
};

const clearCanvas = ({ canvas }) => {
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);  
};

// DOM

const fitCanvasSize = canvas => {
  const style = getComputedStyle(canvas);
  // canvas要素のサイズを設定しないと描画された図形が意図したサイズと異なってしまう。
  canvas.width = parseInt(style.getPropertyValue('width'));
  canvas.height = parseInt(style.getPropertyValue('height'));
};

let drawWorkers = [];

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
    const blob = await canvas.convertToBlob({
      type: root.querySelector('.image-format').value,
      quality: 1
    });
    const resultFormat = root.querySelector('.result-format');
    resultFormat.textContent = blob.type;
    const img = await blobToImage(blob);
    const output = root.querySelector('.output');
    output.innerHTML = '';
    output.appendChild(img);
  },
  async transferControlToOffscreen(root) {
    if (drawWorkers.length > 0) {
      this.stopControlToOffscreen(root);
    }
    const canvas = root.querySelector('.output');
    fitCanvasSize(canvas);
    const array = new Array(parseInt(root.querySelector('.workersize').value));
    const url = await createDrawWorkerURL();
    drawWorkers = array.fill(url, 0, array.length).map(url => {
      // 同じ名前のファイルからはどうしても1つしかWorkerが生成できない？
      // blobURLでWorkerを生成した場合はたとえどれも同じBlobURLだったとしても
      // newした数だけWorkerを生成できているようである。
      const worker = new Worker(url);
      worker.url = url;
      const offscreen = canvas.cloneNode(true).transferControlToOffscreen();
      const fillStyle = `rgba(${getRandomRGBA().join(',')})`;
      const context = canvas.getContext('bitmaprenderer');
      // 第2引数でOffscreenCanvasを渡さないとエラーになる。
      worker.postMessage({ canvas: offscreen, fillStyle }, [offscreen]);
      worker.onmessage = event =>
        context.transferFromImageBitmap(event.data);
      return worker;
    });
  },
  stopControlToOffscreen(root) {
    drawWorkers.forEach(worker => {
      worker.terminate();
      URL.revokeObjectURL(worker.url);
    });
    drawWorkers = [];
  },
  toBlobURLFromCrossOriginImage: async root => {
    const url = 'https://myhost/webxam/image/hello.png';
    //const url = 'https://localhost/webxam/image/hello.png';
    const crossOrigin = Array.from(root.querySelectorAll(`input[name='crossOrigin']`))
      .filter(ele => ele.checked)[0].value;
    const canvas = root.querySelector('.output');
    clearCanvas({ canvas });
    try {
      const blob = await getBlobByCanvas({ url, type: 'image/png', crossOrigin });
      await drawBlob({ blob, canvas });
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  }
};

const addListener = () => {
  document.querySelectorAll('.example').forEach(el => {
    el.addEventListener('click', async event => {
      const root = event.target.dataset.eventTarget;
      if (root) {
        event.stopPropagation();
        await listeners[root](el);
      }
    });
  });
};

const init = () => {
  addListener();
};

init();

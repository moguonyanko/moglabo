/**
 * @fileoverview WeakRef調査用スクリプト
 * 参考:
 * https://github.com/tc39/proposal-weakrefs#weak-references
 */

const makeCachedFunc = heavyOperationFunc => {
  const cache = new Map();
  
  // FinalizationRegistryで後始末を行わないとcacheのエントリが
  // 残り続けてしまうようである。(メモリリークする)
  const cleanup = new FinalizationRegistry(key => {
    // See note below on concurrency considerations.
    // Workerで共有したりするなということか？
    const ref = cache.get(key);
    // もしオブジェクトが既にガベージコレクトされていればderefはundefinedを返す。
    if (ref && !ref.deref()) {
      // ここに到達しなければメモリリークしているということか。
      cache.delete(key);
      console.log(`${key}: Delete cache`);
    }
  });

  const cachedFunc = key => {
    const ref = cache.get(key);
    if (ref) {
      const cached = ref.deref();
      // See note below on concurrency considerations.
      // cachedがundefinedでなければオブジェクトはまだガベージコレクトされていない。
      if (cached !== undefined) {
        console.log(`${key}: Get cache`);
        return cached;
      }
    }

    const fresh = heavyOperationFunc(key);
    cache.set(key, new WeakRef(fresh));
    cleanup.register(fresh, key);
    return fresh;
  };

  return cachedFunc;
};

const getImageArrayBuffer = src => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const [w, h] = [img.naturalWidth, img.naturalHeight];
      const canvas = new OffscreenCanvas(w, h);
      const context = canvas.getContext('2d');
      context.drawImage(img, 0, 0, w, h);
      const imageData = context.getImageData(0, 0, w, h);
      return resolve(imageData.data.buffer);
    };
    img.onerror = reject;
    img.src = src;
  });
};

const dumpBuffers = async () => {
  const getBufCached = makeCachedFunc(getImageArrayBuffer);
  const path = '../../image/hello.png';

  const buf1 = await getBufCached(path);
  const buf2 = await getBufCached(path);
  const buf3 = await getBufCached(path);

  console.log(buf1, buf2, buf3);

  // この関数の後でもFinalizationRegistryの処理が呼び出されない。
};

const runTest = async () => {
  await dumpBuffers();
}; 

// DOM

const getBufferCache = makeCachedFunc(getImageArrayBuffer);

const listeners = {
  getCachedImageArrayBuffer: async () => {
    const file = document.querySelector('#weakRefSampleImage').files.item(0);
    if (!file) {
      return;
    }
    const url = URL.createObjectURL(file);
    const buf = await getBufferCache(url);
    console.log(buf);
    // BlobURLをrevokeしてもFinalizationRegistryの処理が呼び出されない。
    URL.revokeObjectURL(url);
    const output = document.querySelector('.output.weakrefsample');
    output.textContent = `Byte length = ${buf.byteLength}`;
    // キャッシュ関数にnullを代入してもFinalizationRegistryは処理されない。
    //getBufferCache = null;
  }
};

const handler = async event => {
  const target = event.target.dataset.eventTarget;
  if (typeof listeners[target] !== 'function') {
    return;
  }
  event.stopPropagation();
  await listeners[target]();
  // イベントリスナーを解除してもFinalizationRegistryの処理が呼び出されない。
  //removeListener();
};

function addListener() {
  const main = document.querySelector('main');
  main.addEventListener('click', handler);
}

function removeListener() {
  const main = document.querySelector('main');
  main.removeEventListener('click', handler);
}

(async () => {
  await runTest();
  addListener();
})();

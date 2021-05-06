/**
 * @fileoverview 画像生成調査用スクリプト
 */

const outputImageInfo = blob => {
  // OffscreenCavnas.convertToBlobではAVIFのBlobを出力することができない。
  // AVIFのBlobの情報を参照したければレスポンスを直接利用するしかない。

  // const oc = new OffscreenCanvas(img.width, img.height);
  // const ctx = oc.getContext('2d');
  // ctx.drawImage(img, 0, 0, oc.width, oc.height);
  // const blob = await oc.convertToBlob({
  //   type: `image/${format}`,
  // });

  const output = document.querySelector('.output.image-info');
  output.textContent = new Date().toString();
  output.textContent += `:FORMAT=${blob.type},SIZE=${blob.size}`;
};

// 型が等しく順序が重要になる引数はオブジェクトの形式で受け取れるようにする方が間違いが起きにくい。
const loadImageBlob = async () => {
  const [width, height] = [
    document.querySelector('.image-width').value,
    document.querySelector('.image-height').value
  ];
  const format = document.querySelector('select.image-format').value;
  const query = `format=${format}&width=${width}&height=${height}`;
  const imgUrl = `/webxam/apps/practicenode/createimage?${query}`;
  const response = await fetch(imgUrl);
  const blob = await response.blob();
  outputImageInfo(blob);

  return blob;
};

const appendImageElement = ({ blob, output, context }) => {
  const img = new Image();
  const blobUrl = URL.createObjectURL(blob);
  context.drawImage(img, 0, 0, output.width, output.height);
  URL.revokeObjectURL(blobUrl);
  img.onload = () => {
    console.log(blobUrl);
    URL.revokeObjectURL(blobUrl);
    context.drawImage(img, 0, 0, output.width, output.height);
  };
  img.src = blobUrl;
};

const listener = {
  createImage: async () => {
    const blob = await loadImageBlob();
    const output = document.querySelector('.output.createImage');
    const context = output.getContext('2d');
    context.clearRect(0, 0, output.width, output.height);
    try {
      // AVIFはcreateImageBitmapでエラーになる。
      const bitmap = await createImageBitmap(blob);
      context.drawImage(bitmap, 0, 0, output.width, output.height);
    } catch (err) {
      console.log(`${err.message}:${blob.type}`);
      appendImageElement({ blob, output, context });
    }
  }
};

const addListener = () => {
  const main = document.querySelector('main');
  main.addEventListener('click', async event => {
    const { eventTarget } = event.target.dataset;
    if (!eventTarget) {
      return;
    }
    event.stopPropagation();
    if (typeof listener[eventTarget] === 'function') {
      await listener[eventTarget]();
    }
  })
};

const main = () => {
  addListener();
};

main();

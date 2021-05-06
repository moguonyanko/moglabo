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

const listener = {
  createImage: async () => {
    const format = document.querySelector('select.image-format').value;
    const [ width, height ] = [
      document.querySelector('.image-width').value,
      document.querySelector('.image-height').value
    ];
    const query = `format=${format}&width=${width}&height=${height}`;
    const imgUrl = `/webxam/apps/practicenode/createimage?${query}`;
    const response = await fetch(imgUrl);
    const blob = await response.blob();
    outputImageInfo(blob);
    const blobUrl = URL.createObjectURL(blob);
    const img = document.createElement('img');
    img.onload = async () => {
      URL.revokeObjectURL(blobUrl);
      const output = document.querySelector('.output.createImage');
      output.textContent = '';
      output.appendChild(img);
    };
    img.src = blobUrl;
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

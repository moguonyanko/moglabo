/**
 * @fileoverview 画像生成調査用スクリプト
 */

const listener = {
  createImage: async () => {
    const format = document.querySelector('select.image-format').value;
    const [ width, height ] = [
      document.querySelector('.image-width').value,
      document.querySelector('.image-height').value
    ];
    const query = `format=${format}&width=${width}&height=${height}`;
    const result = await fetch(`/webxam/apps/practicenode/createimage?${query}`);
    const output = document.querySelector('canvas.output.createImage');
    const blob = await result.blob();
    console.log(blob);
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const ctx = output.getContext('2d');
      ctx.clearRect(0, 0, output.width, output.height);
      URL.revokeObjectURL(url);
      ctx.drawImage(img, 0, 0, width, height);
    };
    img.src = url;
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

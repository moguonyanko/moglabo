/**
 * @fileoverview NodeにおけるBufferを調査するためのスクリプト
 */

const funcs = {
  getImage: async () => {
    const response = await fetch('/webxam/apps/practicenode/imagebuffer');
    const eles = document.querySelectorAll(`.imagebuffer input[name='imageFormat']`);
    const format = Array.from(eles).filter(el => el.checked)[0].value;
    const buffer = await response.arrayBuffer();
    const data = new Uint8ClampedArray(buffer);
    // const canvas = document.createElement('canvas');
    // canvas.width = 400;
    // canvas.height = 400;
    // const ctx = canvas.getContext('2d');
    // ctx.putImageData({
    //   ...canvas,
    //   data
    // }, 0, 0);
    // const output = document.querySelector(`.output[data-event-output='getImage']`);
    // output.innerHTML = '';
    // output.appendChild(canvas);

    const blob = new Blob([data], { type: `image/${format}` });
    const url = URL.createObjectURL(blob);
    //window.open(url);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const output = document.querySelector(`.output[data-event-output='getImage']`);
      output.innerHTML = '';
      output.appendChild(img);
      URL.revokeObjectURL(url);
    };
  }
};

const init = () => {
  const main = document.querySelector('main');
  main.addEventListener('click', async event => {
    const { eventTarget } = event.target.dataset;
    if (typeof funcs[eventTarget] === 'function') {
      event.stopPropagation();
      await funcs[eventTarget]();
    }
  });
};

init();

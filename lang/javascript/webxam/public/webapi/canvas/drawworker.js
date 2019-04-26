let drawnInfo;

const drawSquare = ({context, width, height}) => {
  const size = 10 + parseInt(Math.random() * 50);
  const x = parseInt(Math.random() * width),
      y = parseInt(Math.random() * height),
      w = size,
      h = size;

  if (!drawnInfo) {
    drawnInfo = {};
  } else {
    context.clearRect(drawnInfo.x, drawnInfo.y, drawnInfo.w, drawnInfo.h);
  }

  Object.assign(drawnInfo, {x, y, w, h});
  context.fillRect(x, y, w, h);
};

globalThis.onmessage = event => {
  const {canvas, fillStyle} = event.data;
  const width = canvas.width, height = canvas.height;

  const context = canvas.getContext('2d');
  context.fillStyle = fillStyle;
  const render = async time => {
    drawSquare({context, width, height});
    // WorkerからのpostMessageにOffscreenCanvasを直接渡すことはできない。
    // 第2引数にOffscreenCanvasを指定してもダメ。ImageBitMapなら渡すことができる。
    // 参考: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
    const bitmap = canvas.transferToImageBitmap();
    // TODO: 常に1つの図形しか描画できていない。
    // createImageBitMapにはOffscreenCanvasを直接渡せる。
    //const bitmap = await createImageBitmap(canvas,
    //    drawnInfo.x, drawnInfo.y, drawnInfo.w, drawnInfo.h);
    globalThis.postMessage(bitmap);
    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
};

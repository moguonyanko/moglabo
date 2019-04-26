const drawCircle = ({context, width, height}) => {
  context.beginPath();
  const r = 10 + parseInt(Math.random() * 50);
  context.arc(Math.random() * width, Math.random() * height, r, 0, 2 * Math.PI);
  context.fill();
};

globalThis.onmessage = event => {
  const {canvas, fillStyle} = event.data;
  const width = canvas.width, height = canvas.height;

  const context = canvas.getContext('2d');
  context.fillStyle = fillStyle;
  const render = time => {
    context.clearRect(0, 0, width, height);
    drawCircle({context, width, height});
    // WorkerからのpostMessageにOffscreenCanvasを直接渡すことはできない。
    // 第2引数にOffscreenCanvasを指定してもダメ。ImageBitMapなら渡すことができる。
    // 参考: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
    globalThis.postMessage(canvas.transferToImageBitmap());
    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
};

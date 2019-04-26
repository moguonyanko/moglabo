globalThis.onmessage = event => {
  const {canvas, fillStyle} = event.data;
  const w = canvas.width, h = canvas.height;

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = fillStyle;
  const render = time => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillRect(Math.random() * w, Math.random() * h, 45, 45);
    requestAnimationFrame(render);
  };
  
  requestAnimationFrame(render);

  // postMessageしなくてもcanvasへの変更はWorker呼び出し元のドキュメントに反映される。
  //globalThis.postMessage('finish');
};

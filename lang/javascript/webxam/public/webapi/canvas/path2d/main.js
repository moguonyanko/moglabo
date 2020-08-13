/**
 * @fileoverview Path2D調査用スクリプト
 * 参考:
 * https://developer.mozilla.org/en-US/docs/Web/API/Path2D/addPath
 */

const getMatrix = ({
  x = 0, y = 0,
  skewX = 0, skewY = 0,
  scaleX = 1, scaleY = 1
}) => {
  const m = new DOMMatrix();

  m.a = scaleX;
  m.b = skewX;
  m.c = skewY;
  m.d = scaleY;
  m.e = x;
  m.f = y;

  return m;
};

const getRectPath = ({ width, height }) => {
  const path = new Path2D();
  path.rect(0, 0, width, height);

  return path;
};

// eslint-disable-next-line no-unused-vars
const runTest = () => {
  const p1 = getRectPath({ width: 100, height: 100 });
  const p2 = getRectPath({ width: 100, height: 100 });

  const canvas = new OffscreenCanvas(400, 400);
  const context = canvas.getContext('2d');

  const matrix = getMatrix({ x: 200, y: 100 });
  p1.addPath(p2, matrix);

  context.fill(p1);
};

//runTest();

// DOM

const samples = {
  addPath: () => {
    const allPath = getRectPath({ width: 100, height: 100 });
    const subPath = getRectPath({ width: 100, height: 100 });
    const matrix = getMatrix({
      x: 100, y: 100,
      skewX: 1, skewY: 1,
      scaleX: 2, scaleY: 2
    });
    allPath.addPath(subPath, matrix);

    const canvas = document.querySelector('.addpath');
    const context = canvas.getContext('2d');
    context.fill(allPath);

    canvas.addEventListener('pointermove', event => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fill(allPath);
      const [testX, testY] = [event.offsetX, event.offsetY];
      // Path2D()の引数にpath要素のd属性を渡すこともできる。
      // 参考: https://developer.mozilla.org/en-US/docs/Web/API/Path2D/Path2D
      const p = new Path2D();
      p.arc(testX, testY, 10, 0, 2 * Math.PI);
      context.save();
      if (context.isPointInPath(allPath, testX, testY)) {
        context.fillStyle = 'white';
      } else {
        context.fillStyle = 'black';
      }
      context.fill(p);
      context.restore();
    })
  }
};

const init = () => {
  Object.values(samples).forEach(f => f());
};

init();

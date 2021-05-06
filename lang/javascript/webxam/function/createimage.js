/**
 * @fileoverview 画像生成調査用スクリプト
 * 参考:
 * https://developer.mozilla.org/en-US/docs/Web/API/Path2D/Path2D
 * https://www.npmjs.com/package/sharp
 */

/* eslint-env node */

const { createCanvas } = require('canvas');
const sharp = require("sharp");

require('canvas-5-polyfill');

const drawSampleImage = (ctx, width, height) => {
  ctx.strokeStyle = 'red';
  const path1 = new Path2D();
  path1.rect(10, 10, width - 20, height - 20);

  const path2 = new Path2D(path1);
  const x = width / 2, y = height / 2;
  path2.moveTo(x, y);
  path2.arc(x - 50, y, 50, 0, 2 * Math.PI);
  ctx.stroke(path2);
};

const getErrorImage = async ({ format, width, height, error }) => {
  // TODO: SVGでエラーメッセージを描画してクライアントに返したい。
  // const input = Buffer.from(
  //   `<svg>
  //   <text x="0" y="35" font-family="Monospace" font-size="35">${error.message}</text>
  //   </svg>`
  // );

  // return await sharp()
  //   .resize(width, height)
  //   .composite([{
  //     input,
  //     blend: 'dest-in'
  //   }])[format]().toBuffer();

  return await sharp({
    create: {
      width, height,
      channels: 4,
      background: { r: 204, g: 204, b: 204, alpha: 1 }
    }
  })[format]().toBuffer();
};

class CreateImage {
  static async draw({ format, width, height }) {
    [ width, height ] = [ parseInt(width), parseInt(height) ];
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    drawSampleImage(ctx, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    //const buff = canvas.toBuffer(`raw`);
    try {
      // TODO: sharp()に渡すBufferをCanvasから取得する方法が不明
      return await sharp(Buffer.from(imageData.data.buffer))
        .toFormat(format).toBuffer();
    } catch (error) {
      console.error(error.message);
      return await getErrorImage({ format, width, height, error });
    }
  }
}

module.exports = CreateImage;

/**
 * @fileoverview 画像生成調査用スクリプト
 * 参考:
 * https://developer.mozilla.org/en-US/docs/Web/API/Path2D/Path2D
 * https://www.npmjs.com/package/sharp
 * https://sharp.pixelplumbing.com/api-output#avif
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
  const errMsg = `${error.message}:${format}`;
  console.error(errMsg);

  // TODO: SVGでエラーメッセージを描画してクライアントに返したい。
  const input = Buffer.from(
    `<svg>
    <text x="0" y="35" font-family="Monospace" font-size="35">${errMsg}</text>
    </svg>`
  );

  return await sharp()
    .resize(width, height)
    .composite([{
      input,
      blend: 'dest-in'
    }]).png().toBuffer();
};

const defaultOptions = { quality: 50, speed: 5 };

const getBuffer = (canvas, format, options = defaultOptions) => {
  return new Promise((resolve, reject) => {
    canvas.toBuffer(async (err, buff) => {
      if (!err) {
        try {
          const result = await sharp(buff)
            .toFormat(format, options)
            .toBuffer();
          resolve(result);
        } catch (e) {
          reject(e);
        }
      } else {
        reject(err);
      }
    });
  });
};

class CreateImage {
  static async draw({ format, width, height }) {
    [width, height] = [parseInt(width), parseInt(height)];
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    drawSampleImage(ctx, width, height);

    try {
      return await getBuffer(canvas, format);
    } catch (error) {
      return await getErrorImage({ format, width, height, error });
    }
  }
}

module.exports = CreateImage;

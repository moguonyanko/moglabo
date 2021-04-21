/**
 * @fileoverview 画像生成調査用スクリプト
 * 参考:
 * https://developer.mozilla.org/en-US/docs/Web/API/Path2D/Path2D
 */

/* eslint-env node */

const { createCanvas } = require('canvas');
require('canvas-5-polyfill');

class CreateImage {
  draw({ format, width, height }) {
    const canvas = createCanvas(parseInt(width), parseInt(height));
    const ctx = canvas.getContext('2d');

    ctx.strokeStyle = 'red';
    const path1 = new Path2D();
    path1.rect(10, 10, width - 20, height - 20);

    const path2 = new Path2D(path1);
    const x = width / 2, y = height / 2;
    path2.moveTo(x, y);
    path2.arc(x - 50, y, 50, 0, 2 * Math.PI);
    ctx.stroke(path2);

    return canvas.toBuffer(`image/${format}`);
  }
}

module.exports = CreateImage;

/**
 * @fileoverview 2倍チェック
 * 問題
 * https://atcoder.jp/contests/past201912-open/tasks/past201912_a
 * 解説
 * https://blog.hamayanhamayan.com/entry/2019/12/31/235018
 * parseIntを使わずに文字列を数値に変換する方法
 * https://www.freecodecamp.org/news/how-to-convert-a-string-to-a-number-in-javascript/#:~:text=(quantity))%3B-,How%20to%20convert%20a%20string%20to%20a%20number%20in%20JavaScript,will%20go%20before%20the%20operand.&text=We%20can%20also%20use%20the,into%20a%20floating%20point%20number.
 */

import KyoPro from '../../kyopro.js';

class Runner {
  // マルチバイト文字を考慮していない。
  run(args) {
    const param = '' + args;
    let base = 0;
    for (let i = 0; i < param.length; i++) {
      const c = param[i];
      if ('0' <= c && c <= '9') {
        base += (+c) * (10 ** ((param.length - 1) - i));
      } else {
        return 'error';
      }
    }
    return base * 2;
  }

  runWithJavaScriptAPI(args) {
    const value = parseInt(args);
    if (isNaN(value)) {
      return 'error';
    }
    return value * 2;
  }
}

new KyoPro(new Runner()).start();

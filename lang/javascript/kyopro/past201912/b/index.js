/**
 * @fileoverview 増減管理
 * 問題
 * https://atcoder.jp/contests/past201912-open/tasks/past201912_b
 * 解説
 * https://blog.hamayanhamayan.com/entry/2019/12/31/235119
 */

import KyoPro from '../../kyopro.js';

class Runner {
  run(args) {
    const list = args.split('\n');
    const n = parseInt(list[0]);
    const result = [];
    let pre = list[1];
    for (let i = 2; i <= n; i++) {
      const a = parseInt(list[i]);
      if (a < pre) {
        result.push(`down ${pre - a}`);
      } else if (a === pre) {
        result.push('stay');
      } else {
        result.push(`up ${a - pre}`);
      } 
      pre = a;
    }
    return result.join('<br />');
  }
}

new KyoPro(new Runner()).start();

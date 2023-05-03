/**
 * @fileoverview 重複検査
 * 問題
 * https://atcoder.jp/contests/past201912-open/tasks/past201912_d
 * 解説
 * https://blog.hamayanhamayan.com/entry/2019/12/31/235320
 */

import KyoPro from '../../kyopro.js';

class Runner {
  run(args) {
    const params = args.split('\n').map(v => parseInt(v.trim()));
    const size = params[0];
    const dict = {};
    for (let i = 1; i <= size; i++) {
      dict[i] = 0;      
    }
    for (let i = 1; i <= size; i++) {
      const v = params[i];
      dict[v]++;
    }
    let value = null, org = null;
    for (let i = 1; i <= size; i++) {
      if (dict[i] > 1) {
        value = i;
      }
      if (dict[i] === 0) {
        org = i;
      }
    }
    if (value === null) {
      return 'Correct';
    } else {
      return `${value} ${org}`;
    }
  }
}

new KyoPro(new Runner()).start();

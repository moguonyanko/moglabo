/**
 * @fileoverview 3番目
 * 問題
 * https://atcoder.jp/contests/past201912-open/tasks/past201912_c
 * 解説
 * https://blog.hamayanhamayan.com/entry/2019/12/31/235219
 */

import KyoPro from '../../kyopro.js';

class Runner {
  // あえてソートしない版
  run(args) {
    const params = args.split(' ').map(v => parseInt(v));
    const getMax = ps => {
      let result = 0, index = 0;
      for (let i = 0; i < ps.length; i++) {
        if (result < ps[i]) {
          result = ps[i];
          index = i;
        } 
      }
      return { result, index };
    };
    params[getMax(params).index] = NaN; // 1番目に大きな数をNaNに差し替え
    params[getMax(params).index] = NaN; // 2番目に大きな数をNaNに差し替え
    return getMax(params).result;
  }
  
  runWithSortFunction(args) {
    const params = args.split(' ').map(v => parseInt(v));
    params.sort((a, b) => b - a);
    return params[2];
  }
}

new KyoPro(new Runner()).start();

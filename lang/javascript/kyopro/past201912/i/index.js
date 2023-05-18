/**
 * @fileoverview 
 * 問題
 * https://atcoder.jp/contests/past201912-open/tasks/past201912_i
 * 解説
 * 
 */

import KyoPro from '../../kyopro.js';

class Runner {
  run(args) {
    const lines = args.split('\n');
    const [itemSize, orderSize] = lines[0].trim().split(' ').map(v => parseInt(v.trim()));
    const orders = lines.slice(1);

    const result = {};
    for (let setIndex = 0; setIndex < orderSize; setIndex++) {
      const [order, price] = orders[setIndex].trim().split(' ').map(v => v.trim());
      for (let itemIndex = 0; itemIndex < itemSize; itemIndex++) {
        const itemExist = order[itemIndex];
        if (itemExist === 'Y') {
          if (!result[itemIndex]) result[itemIndex] = { price: 1_000_000_000 };
          const currentPrice = parseInt(price);
          if (result[itemIndex].price > currentPrice) {
            result[itemIndex] = { price: currentPrice, setIndex };
          }
        }
      }
    }

    // resultのサイズとitemSizeが等しくなければ揃わない部品が存在する。
    if (Object.keys(result).length !== itemSize) {
      return -1;
    }

    // ここまできたら全種類部品があることが分かっているのでセットごとに金額をまとめてしまう。
    const setMap = {};
    for (let itemIndex in result) {
      const { price, setIndex } = result[itemIndex];
      setMap[setIndex] = price;
    }

    // const setMap = Object.entries(result)
    //   .map((key, value) => { return { [key]: value }; })
    //   .reduce((acc, value) => Object.assign(acc, value), {});

    return Object.values(setMap).reduce((acc, current) => acc + current, 0);
  }
}

new KyoPro(new Runner()).start();

/**
 * @fileoverview 
 * 問題
 * https://atcoder.jp/contests/past201912-open/tasks/past201912_i
 * 解説
 * https://blog.hamayanhamayan.com/entry/2019/12/31/235848
 */

import KyoPro from '../../kyopro.js';

class Order {
  constructor() {
    this.orderIndex = -1;
    this.price = 1_000_000_000;
  }

  setInfo({ orderIndex, price }) {
    this.orderIndex = orderIndex;
    this.price = parseInt(price);
  }

  equals(other) {
    if (!(other instanceof Order)) {
      return false;
    }
    return this.orderIndex === other.orderIndex;
  }

  exists() {
    return this.orderIndex > -1;
  }
}

class Runner {
  /**
   * @todo DPを使って解くように修正したい。ただしDPを使ってもループの回数は減らない。
   */
  run(args) {
    const lines = args.split('\n');
    const [itemSize, orderSize] = lines[0].trim().split(' ').map(v => parseInt(v.trim()));
    const orders = lines.slice(1);
    const itemOrders = [];
    /**
     * new Array(itemSize).fill(new Order()) では全ての配列の要素に同一のOrderインスタンスが
     * 割り当てられてしまう。
     */
    for (let i = 0; i < itemSize; i++) {
      itemOrders.push(new Order());
    }
    for (let orderIndex = 0; orderIndex < orderSize; orderIndex++) {
      const [items, price] = orders[orderIndex].trim().split(' ').map(v => v.trim());
      for (let itemIndex = 0; itemIndex < itemSize; itemIndex++) {
        if (items[itemIndex] === 'Y' && itemOrders[itemIndex].price > parseInt(price)) {
          itemOrders[itemIndex].setInfo({ orderIndex, price });
        }
      }
    }

    for (let i = 0; i < itemSize; i++) {
      if (!itemOrders[i].exists()) {
        return -1;
      }
    }

    const checkedIndexes = new Set();
    let result = 0;
    for (let i = 0; i < itemSize; i++) {
      if (!checkedIndexes.has(itemOrders[i].orderIndex)) {
        result += itemOrders[i].price;
        checkedIndexes.add(itemOrders[i].orderIndex);
      }
    }
    return result;
  }

  old_run(args) {
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

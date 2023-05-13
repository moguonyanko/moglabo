/**
 * @fileoverview まとめ売り
 * 問題
 * https://atcoder.jp/contests/past201912-open/tasks/past201912_h
 * 解説
 * https://blog.hamayanhamayan.com/entry/2019/12/31/235746
 */

import KyoPro from '../../kyopro.js';

const updateCards = (cards, cardIndex, buySize) => {
  const zaiko = cards[cardIndex];
  if (zaiko >= buySize) {
    cards[cardIndex] -= buySize;
    return buySize;
  } else {
    return 0;
  }
};

const updateMultiCards = (cards, buySize, opt_filter = () => true) => {
  let boughtSize = 0;
  /**
   * 一つでも在庫不足があれば何もしないので全ての在庫が足りていたことが確認できるまで
   * 一時的なcardsを使ってupdateCardsを行う。
   */
  let tmpCards = [...cards];
  for (let i = 0; i < tmpCards.length; i++) {
    if (opt_filter(i)) {
      let size = updateCards(tmpCards, i, buySize);
      if (size === buySize) {
        boughtSize += buySize;
      } else {
        return 0;
      }
    }
  }
  // 全ての在庫が足りていたので引数のcardsにtmpCardsの内容をコピーする。
  cards.splice(0, tmpCards.length, ...tmpCards);
  return boughtSize;
};

class Runner {
  run(args) {
    const lines = args.split('\n');
    const cards = lines[1].split(' ').map(v => parseInt(v.trim()));

    let result = 0;
    for (let i = 3; i < lines.length; i++) {
      const line = lines[i];
      const param = line.split(' ').map(v => parseInt(v.trim()));
      const type = param[0];
      if (type === 1) {
          let size = updateCards(cards, param[1] - 1, param[2]);
          if (size > 0) {
            result += size;
          } 
      } else if (type === 2) {
          result += updateMultiCards(cards, param[1], index => (index + 1) % 2 !== 0);
      } else if (type === 3) {
          result += updateMultiCards(cards, param[1]);
      }
    }
    return result;
  }
}

new KyoPro(new Runner()).start();

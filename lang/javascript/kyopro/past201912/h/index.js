/**
 * @fileoverview まとめ売り
 * 問題
 * 
 * 解説
 * 
 */

import KyoPro from '../../kyopro.js';

const updateCards = (cards, cardNumber, buySize) => {
  const zaiko = cards[cardNumber];
  if (zaiko >= buySize) {
    cards[cardNumber] -= buySize;
    return buySize;
  } else {
    return 0;
  }
};

const updateMultiCards = (cards, buySize, opt_filter = () => true) => {
  let size = 0, boughtSize = 0;
  for (let i = 0; i < cards.length; i++) {
    if (opt_filter) {
      size = updateCards(cards, i, buySize);
      if (size) {
        boughtSize += buySize;
      } else {
        break;
      }
    }
  }
  return boughtSize;
};

class Runner {
  run(args) {
    const lines = args.split('\n');
    //const size = parseInt(lines[0].trim());
    const cards = lines[1].split(' ').map(v => parseInt(v.trim()));
    const querySize = parseInt(lines[2].trim());

    let result = 0;
    for (let i = 3; i <= querySize; i++) {
      const line = lines[i];
      const param = line.split(' ').map(v => parseInt(v.trim()));
      switch (param[0]) {
        case 1: 
          let size = updateCards(cards, param[1] - 1, param[2]);
          if (size !== 0) {
            result += size;
          } 
        case 2:
          result += updateMultiCards(cards, param[2], index => (index + 1) % 2 !== 0);
        case 3:
          result += updateMultiCards(cards, param[2]);
      }
    }
    return result;
  }
}

new KyoPro(new Runner()).start();

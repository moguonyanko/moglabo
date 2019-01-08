/**
 * @fileOverview flat系関数の練習用スクリプト
 */

/**
 * 配列を文字列に変換せずに配列の比較を行う関数
 * 
 * 配列をArray.prototype.joinで文字列に変換し比較しまうと
 * A:[1,'2,3']
 * B:[1,2,3]
 * といった場合にAとBは等しい配列だと判定してしまう。
 * 
 * 参考:
 * https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
 */
const arrayEquals = (a1, a2) => {
  if (!a1 || !a2) {
    return false;
  }
  if (a1.length !== a2.length) {
    return false;
  }
  for (let i = 0, limit = a1.length; i < limit; i++) {
    if (Array.isArray(a1[i]) && Array.isArray(a2[i])) {
      if (!arrayEquals(a1[i], a2[i])) {
        return false;
      }
    } else if (typeof a1[i].equals === 'function') {
      // もしequalsを実装しているオブジェクトだったらequalsで比較する。
      return a1[i].equals(a2[i]);
    } else if (a1[i] !== a2[i]) {
      return false;
    }
  }
  return true;
};

const doFlat = ({array, depth = 1}) => {
  return array.flat(depth);
};

// DOM

const funcs = {
  flat() {
    const array = [1, 2, 3, [4, 5], ['6,7,8', [9, [0]]]];
    const depth = parseInt(document.querySelector('.depth').value);
    const value = doFlat({array, depth});
    return value;
  }
};

const addListener = () => {
  const ctl = document.querySelector('.control');
  ctl.addEventListener('click', event => {
    const t = event.target;
    if (t.classList.contains('target')) {
      event.stopPropagation();
      const res = document.querySelector('.result');
      if (t.classList.contains('run')) {
        const value = funcs.flat();
        // 配列をtoStringするとフラットにされてしまう。
        res.innerHTML += JSON.stringify(value);
      } else if (t.classList.contains('clear')) {
        res.innerHTML = '';
      }
    }
  });
};

const runTest = () => {
  const array = [1, 2, 3, [4, 5, 6, [7, 8, 9]]];
  const depth = 2;
  const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const actual = doFlat({array, depth});
  console.log(`arrayEquals(actual, expected): ${arrayEquals(actual, expected)}`);
  console.log(expected, actual);
};

const main = () => {
  runTest();
  addListener();
};

window.addEventListener('DOMContentLoaded', main);

/**
 * @fileoverview DoubleCamelCase Sort
 * 問題
 * https://atcoder.jp/contests/past201912-open/tasks/past201912_f
 * 解説
 * https://blog.hamayanhamayan.com/entry/2019/12/31/235544
 */

import KyoPro from '../../kyopro.js';

/**
 * 単にArray.prototype.sortするとAaとACならACが先に並んでしまう。
 * この関数では大文字小文字の違いを無視してアルファベット順に単語を並べて返す。
 */
const sortWordsIgnoreCase = words => {
  const dict = {};
  words.forEach(word => {
    // 同じ単語が複数含まれることがあるので配列を値に持たせる。
    if (!dict[word.toUpperCase()]) dict[word.toUpperCase()] = [];
    dict[word.toUpperCase()].push(word);
  });
  const keys = Object.keys(dict).sort();
  const result = [];
  for (let key of keys) {
    result.push(...dict[key]);
  }

  return result.join('');
};

class Runner {
  run(args) {
    const reg = /[A-Z]/;
    const words = [];

    let word = [];
    for (let i = 0; i < args.length; i++) {
      const w = args[i];
      if (reg.test(w)) {
        word.push(w);
        if (word.length > 1) { // 単語は2文字以上
          words.push(word.join('')); // 単語1つ完成
          word = [];
        }
      } else if (word.length > 0) { // 小文字が続いている(単語作成中)
        word.push(w);
      }
    }

    return sortWordsIgnoreCase(words);
  }
}

new KyoPro(new Runner()).start();

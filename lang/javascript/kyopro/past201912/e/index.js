/**
 * @fileoverview 重複検査
 * 問題
 * https://atcoder.jp/contests/past201912-open/tasks/past201912_e
 * 解説
 * 
 */

import KyoPro from '../../kyopro.js';

class Runner {
  run(args) {
    const lines = args.split('\n').map(line => line.trim());
    const [memberSize, logSize] = lines[0].split(' ').map(v => parseInt(v.trim()));
    const followMap = {};
    for (let i = 1; i <= memberSize; i++) {
      followMap[i] = new Array(memberSize).fill('N');
    }
    for (let i = 1; i <= logSize; i++) {
      const [type, member, target] = lines[i].split(' ').map(v => parseInt(v));
      if (type === 2) {
        for (let j = 1; j <= memberSize; j++) {
          if (followMap[j][member - 1] === 'Y') {
            followMap[member][j - 1] = 'Y';
          }
        }
      } else if (type === 3) {
        const currentFollows = followMap[member];
        for (let i = 0; i < currentFollows.length; i++) {
          if (currentFollows[i] === 'Y') {
            const userFollows = followMap[i + 1];
            for (let j = 0; j < userFollows.length; j++) {
              if (userFollows[j] === 'Y') {
                currentFollows[j] = 'Y';
              }
            }
          }
        }
      } else {
        followMap[member][target - 1] = 'Y';
      }
    }

    return JSON.stringify(Object.values(followMap).map(v => v));
  }
}

new KyoPro(new Runner()).start();

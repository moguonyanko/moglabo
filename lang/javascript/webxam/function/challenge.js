/**
 * @fileoverview 認証用Challenge生成用モジュール
 */

/* eslint no-undef: "error" */
/* eslint-env node */

const Chance = require('chance');

class Challenge {
  constructor() {
    this.chance = new Chance();
  }

  getValue({ length = 16 } = {}) {
    return this.chance.string({ length });
  }
}

// eslint-disable-next-line no-unused-vars
const runTest = () => {
  const challenge = new Challenge();
  let length = 32;
  console.log(`1st: ${challenge.getValue({ length })}`);
  console.log(`2nd: ${challenge.getValue({ length })}`);
  console.log(`3rd: ${challenge.getValue({ length })}`);
  console.log('--- Not length parameter test --- ');
  console.log(`4th: ${challenge.getValue()}`);
  console.log('Finished');
};

//runTest();

module.exports = Challenge;

/**
 * @fileOverview ランダムな数値列を返すモジュール
 */

/*eslint no-undef: "error"*/
/*eslint-env node*/

const Chance = require('chance');
const url = require('url');

const defaultMin = 0x00, defaultMax = 0xFF;
const defaultSize = 32;

class RandomNumber {
    constructor() {
        this.chance = new Chance();
        this.contentType = 'application/json';
    }

    execute({ request, response }) {
        const query = url.parse(request.url, true).query;
        const min = !isNaN(parseInt(query.min)) ? parseInt(query.min) : defaultMin,
            max = !isNaN(parseInt(query.max)) ? parseInt(query.max) : defaultMax;
        const challengeSize = !isNaN(parseInt(query.challengesize)) ?
            parseInt(query.challengesize) : defaultSize;
        const numbers = [];
        for (let i = 0; i < challengeSize; i++) {
            numbers.push(this.chance.integer({ min, max }));
        }
        response.write(JSON.stringify(numbers));
    }
}

module.exports = RandomNumber;

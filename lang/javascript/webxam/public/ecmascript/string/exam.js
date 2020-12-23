/**
 * @fileoverview String調査用スクリプト
 * private fieldは未対応ブラウザが多いためまだ使わない。
 */

class MaskString {
    constructor({ target, padString }) {
        this.target = target;
        this.padString = padString;
    }

    get length() {
        return this.target.length;
    }

    checkLength(length) {
        if (isNaN(parseInt(length))) {
            return this.length;
        }
        if (length <= this.length) {
            return length;
        } else {
            // lengthが文字列のサイズよりも大きい場合は文字列全体を
            // マスクできるように文字列全体をsliceできる値を返す。
            return this.length * 2;
        }
    }

    maskStart(length = this.length) {
        const s = this.target.slice(this.checkLength(length) - this.length);
        return s.padStart(this.length, this.padString);
    }

    maskEnd(length = this.length) {
        const s = this.target.slice(0, this.length - this.checkLength(length));
        return s.padEnd(this.length, this.padString);
    }
}

const runTest = () => {
    const target = 'ABC12345EFG', padString = '*';
    const ms = new MaskString({ target, padString });
    console.log(ms.maskStart());
    console.log(ms.maskStart(3));
    console.log(ms.maskEnd());
    console.log(ms.maskEnd(4));
    console.log(ms.maskStart(100));
    console.log(ms.maskEnd(100));
};

// DOM

const funcs = {
    matchAll: ele => {
        const sampleText = ele.querySelector('.sample-text').value,
            matcher = ele.querySelector('.matcher').value;
        const result = sampleText.matchAll(new RegExp(matcher, 'g'));
        const output = ele.querySelector('.output');
        output.innerHTML = [...result];
    },
    maskString: () => {
        const text = document.querySelector('.masktext');
        const target = text.value,
            padString = '?';
        const ms = new MaskString({ target, padString });
        const size = parseInt(document.querySelector('.masksize').value);
        if (document.querySelector('.paddirection').checked) {
            text.value = ms.maskStart(size);
        } else {
            text.value = ms.maskEnd(size);
        }
    },
    atString: () => {
        const text = document.querySelector('.target-text').value;
        const index = parseInt(document.querySelector('.target-index').value);
        const output = document.querySelector('.example.stringat .output');
        try {
            const result = text.at(index);
            console.log(result);
            output.value = result;
        } catch(err) {
            output.value = `${index}の文字取得失敗`;
        }
    }
};

const addListener = () => {
    const eles = document.querySelectorAll('.example');
    eles.forEach(ele => {
        ele.addEventListener('click', event => {
            const t = event.target.dataset.eventTarget;
            if (!t) {
                return;
            }
            if (typeof funcs[t] === 'function') {
                funcs[t](ele);
            }
        });
    });
};

const main = () => {
    runTest();
    addListener();
};

main();
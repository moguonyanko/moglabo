/**
 * @fileOverview 基本データ型BigInt調査用モジュール
 */

const getMaxInteger64 = () => 2n ** (64n - 1n) - 1n;

const toBigInt = n => BigInt(n);

const getBigIntArray = ({array, BIArray}) => {
    const ba = new BIArray(array.length);
    array.forEach((value, index) => ba[index] = toBigInt(value));
    return ba;
};

const getBigInt64Array = array => getBigIntArray({
    array,
    BIArray: BigInt64Array
});

const getBigUint64Array = array => getBigIntArray({
    array,
    BIArray: BigUint64Array
});

// BigInt同士の計算では64bitで扱える数値の範囲を超えられてしまうが、
// BigInt.asIntNやBigInt.asUintNを適用することで64bitの範囲に計算結果を
// 収めることができる。
const asBigInt = ({bit, value, unsigned = false}) => {
    if (unsigned) {
        return BigInt.asIntN(bit, value);
    } else {
        return BigInt.asUintN(bit, value);
    }
};

const runTest = () => {
    const n = 1;
    console.log(toBigInt(n), typeof toBigInt(n));
    
    const max = getMaxInteger64();
    const value = max + 1n;
    const bit = 64;
    console.log(value, asBigInt({
        bit, 
        value
    }));
    console.log(value, asBigInt({
        bit, 
        value,
        unsigned: true
    }));
    
    const array = [1, 10, 100, 1000, Number.MIN_SAFE_INTEGER];
    console.log(getBigInt64Array(array));
    console.log(getBigUint64Array(array));
};

const myBigInt = {
    toBigInt,
    asBigInt,
    getBigInt64Array,
    getBigUint64Array,
    test: {
        runTest
    }
};

export default myBigInt;

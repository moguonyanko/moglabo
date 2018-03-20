/**
 * @fileOverview 装備改修に必要になるネジの数の期待値を計算するモジュール
 * @version 0.01
 */

class Item {
    /**
     * name 装備名
     * firstScrew 改修度0から改修更新までに必要な各段階のネジの数をまとめた配列
     */
    constructor( {name, screws}) {
        this.name = name;
        this.screws = screws;
    }
}

/**
 * 各改修段階における改修成功率のサンプル
 */
const sampleSuccessProbs = [
    1,
    1,
    1,
    1,
    1, //改修度5までは失敗しないとみなす。
    0.95,
    0.80,
    0.70,
    0.60,
    0.50,
    0.25 //上位装備への更新成功率
];

const getExpectation = ({item, probs, implementLevel}) => {
    // 目標とする改修度のインデックス
    const impLvIdx = implementLevel - 1;
    const screws = item.screws.slice(item.screws.length - impLvIdx);
    const result = screws.map((screw, index) => [screw, probs[index]])
        .reduce((acc, pair) => acc + (pair[0] * pair[1]), 0);
    return result;
};

const runTest = () => {
    // TODO: ネジの数がどの段階でも1回で改修に成功する前提の数になっている。
    // そのため得られるネジの数の期待値が実際より少なくなってしまう。
    const sampleItem = new Item({
        name: "46cm三連装砲改",
        screws: [
            5, 5, 5, 5, 5, 5, 8, 8, 8, 8
        ]
    });

    const implementLevel = 10; // 改修更新は行わない
    
    const result = getExpectation({
        item: sampleItem,
        probs: sampleSuccessProbs,
        implementLevel
    });

    let lvStr;
    if (implementLevel === 10) {
        lvStr = "改修max";
    } else if (implementLevel > 10) {
        lvStr = "改修更新";
    } else {
        lvStr = `改修度${implementLevel}`;
    }

    console.log(`${sampleItem.name}の${lvStr}までに必要なネジの数の期待値は${result}個`);
};

const screwexpectation = {
    test: {
        runTest
    }
};

export default screwexpectation;
    
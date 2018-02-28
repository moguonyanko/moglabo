// プロパティをSymbolにするとfor...inによるイテレーションができない。
// JSON.stringifyでJSON文字列化することもできなくなる。
// 参考: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Symbol
const SUPPORT = {
    AIR: "航空支援",
    SUBMARINE: "航空支援(対潜支援)",
    FIRE: "砲撃支援",
    TORPEDO: "雷撃支援"
};
const SUPPORT_TYPE = {
    AC: "空母系",
    ASA: "航空支援系A",
    ASB: "航空支援系B",
    FIRE: "砲撃支援系",
    OTHER: "その他"
};

class ShipType {
    constructor( {typeName, supportType = SUPPORT_TYPE.OTHER}) {
        this.typeName = typeName;
        this.supportType = supportType;
    }
}

class Ship {
    constructor( {antisubmarine = false, shipType}) {
        this.antisubmarine = antisubmarine; // 対潜航空攻撃可能
        this.shipType = shipType;
    }

    get supportType() {
        return SUPPORT_TYPE[this.shipType.supportType] || SUPPORT_TYPE.OTHER;
    }

    toString() {
        return `[${this.shipType.typeName}:対潜航空攻撃${this.antisubmarine ? "可能" : "不可能"}]`;
    }
}

const ESSENCIAL_SHIP = new Ship({
    antisubmarine: false,
    shipType: new ShipType({typeName: "駆逐艦"})
});

// 駆逐艦2隻は支援艦隊に必須。
const ESSENCIAL_SHIPS = [ESSENCIAL_SHIP, ESSENCIAL_SHIP];

class Fleet {
    constructor( {ships = []} = {}) {
        this.ships = ships.concat(ESSENCIAL_SHIPS);
        const reducer = (acc, current) => {
            const count = acc.get(current) || 0;
            acc.set(current, count + 1);
            return acc;
        };
        this.shipTypeNames = this.ships.map(ship => ship.shipType.typeName)
            .reduce(reducer, new Map());
        this.supportTypes = this.ships.map(ship => ship.shipType.supportType)
            .reduce(reducer, new Map());
    }

    getShipTypeCount(predicate) {
        let count = 0;
        for (let [typeName, size] of this.shipTypeNames) {
            if (predicate(typeName)) {
                count += size;
            }
        }
        return count;
    }

    // 戦艦系の数
    get senkanCount() {
        const types = ["戦艦", "高速戦艦", "航空戦艦"];
        return this.getShipTypeCount(typeName => types.includes(typeName));
    }

    // 重巡系の数
    get jyujyunCount() {
        const types = ["重巡洋艦", "航空巡洋艦"];
        return this.getShipTypeCount(typeName => types.includes(typeName));
    }

    get canAntiSubmarine() {
        const existAntiSubmarineKeibo = ship => {
            return ship.shipType.typeName === "軽空母" && ship.antisubmarine;
        };
        if (!this.ships.some(existAntiSubmarineKeibo)) {
            return false;
        }

        const antiSubmarinaCountMap = new Map();
        this.ships.forEach(ship => {
            if (ship.antisubmarine) {
                const typeName = ship.shipType.typeName;
                const currentCount = antiSubmarinaCountMap.get(typeName) || 0;
                antiSubmarinaCountMap.set(typeName, currentCount + 1);
            }
        });
        if (antiSubmarinaCountMap.get("軽空母") >= 2 ||
            antiSubmarinaCountMap.get("海防艦") >= 2 ||
            antiSubmarinaCountMap.has("水上機母艦") ||
            antiSubmarinaCountMap.has("補給艦") ||
            antiSubmarinaCountMap.has("揚陸艦") ||
            antiSubmarinaCountMap.has("軽巡洋艦")) {
            return true;
        } else {
            return false;
        }
    }

    checkSupport() {
        const acCount = this.supportTypes.get(SUPPORT_TYPE.AC);
        const asaCount = this.supportTypes.get(SUPPORT_TYPE.ASA);
        const asbCount = this.supportTypes.get(SUPPORT_TYPE.ASB);
        const fireCount = this.supportTypes.get(SUPPORT_TYPE.FIRE);

        let support = SUPPORT.TORPEDO;
        if (fireCount >= 1) {
            if ((acCount + asaCount) >= 2) {
                support = SUPPORT.AIR;
            } else {
                const bc = this.senkanCount,
                    hc = this.jyujyunCount;
                if (bc >= 2 ||
                    (bc >= 1 && hc >= 3) ||
                    hc >= 4) {
                    support = SUPPORT.FIRE;
                }
            }
        } else {
            if (acCount >= 1 ||
                (asaCount >= 2 || asbCount >= 2)) {
                support = SUPPORT.AIR;
            }
        }
        return support;
    }

    get support() {
        let result = this.checkSupport();

        if (result === SUPPORT.AIR && this.canAntiSubmarine) {
            result = SUPPORT.SUBMARINE;
        }

        return result;
    }

    toString() {
        return this.ships.map(ship => ship.toString()).join(",");
    }
}

const loadConfig = async () => {
    const response = await fetch("../../scripts/supportchecker/supporttype.json");
    if (!response.ok) {
        throw new Error("支援タイプ設定読み込み失敗");
    }
    const supportTypeConfig = await response.json();
    return supportTypeConfig;
};

// for Test
const getTestFleetA = () => {
    const s1 = new Ship({
        antisubmarine: true,
        shipType: new ShipType({
            typeName: "軽空母",
            supportType: SUPPORT_TYPE.AC
        })}),
        s2 = new Ship({shipType: new ShipType({
                typeName: "軽空母",
                supportType: SUPPORT_TYPE.AC
            })}),
        s3 = new Ship({
            antisubmarine: true,
            shipType: new ShipType({
                typeName: "水上機母艦",
                supportType: SUPPORT_TYPE.ASA
            })}),
        s4 = new Ship({shipType: new ShipType({
                typeName: "航空巡洋艦",
                supportType: SUPPORT_TYPE.ASB
            })});
    const ships = [
        s1, s2, s3, s4
    ];
    return new Fleet({ships});
};

const getTestFleetB = () => {
    const s1 = new Ship({
        shipType: new ShipType({
            typeName: "戦艦",
            supportType: SUPPORT_TYPE.FIRE
        })}),
        s2 = new Ship({
            antisubmarine: true,
            shipType: new ShipType({
                typeName: "補給艦",
                supportType: SUPPORT_TYPE.ASB
            })}),
        s3 = new Ship({
            antisubmarine: true,
            shipType: new ShipType({
                typeName: "軽空母",
                supportType: SUPPORT_TYPE.AC
            })}),
        s4 = new Ship({shipType: new ShipType({
                typeName: "戦艦",
                supportType: SUPPORT_TYPE.FIRE
            })});
    const ships = [
        s1, s2, s3, s4
    ];
    return new Fleet({ships});
};

const runTest = () => {
    const fleet = getTestFleetB();
    const support = fleet.support;
    console.log(fleet);
    console.log(fleet.toString());
    console.log(`支援タイプは ${support} です。`);
};

const main = async () => {
    runTest();
    try {
        const config = await loadConfig();
        console.log(config);
    } catch (err) {
        console.error(err.message);
    }
};

// main関数をexportして外部から呼び出すのでもいいがimport及びexportに対応していない
// ブラウザで動作しなくなってしまう。
// async functionはawaitを指定せずに呼び出すとPromiseが返るのだが、
// 以下のmain呼び出しではthen()を呼び出さずmain()だけでも正しい結果が得られてしまう。
//main().then();
window.addEventListener("DOMContentLoaded", async () => { await main(); });

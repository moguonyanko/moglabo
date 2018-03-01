/**
 * @fileOverview 支援艦隊のタイプを調べて返すモジュール
 */


// プロパティをSymbolにするとfor...inによるイテレーションができない。
// JSON.stringifyでJSON文字列化することもできなくなる。
// 参考: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Symbol

/**
 * @description 支援艦隊のタイプ
 */
const SUPPORT = {
    AIR: "航空支援",
    SUBMARINE: "航空支援(対潜支援)",
    FIRE: "砲撃支援",
    TORPEDO: "雷撃支援"
};
/**
 * @description 艦の支援タイプ
 */
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

/**
 * @description 支援艦隊を構成する艦
 * @todo このクラスに限らず艦種名をハードコーディングしている箇所を整理する。
 */
class Ship {
    constructor( {antisubmarine = false, shipType}) {
        this.antisubmarine = antisubmarine; // 対潜航空攻撃可能
        if (shipType.typeName === "海防艦") {
            // 海防艦は対潜航空攻撃の可否を問われないので常にtrueとする。
            this.antisubmarine = true;
        }
        this.shipType = shipType;
    }

    get supportType() {
        return SUPPORT_TYPE[this.shipType.supportType] || SUPPORT_TYPE.OTHER;
    }

    toString() {
        return `[${this.shipType.typeName}:対潜航空攻撃${this.antisubmarine ? "可能" : "不可能"}]`;
    }
}

/**
 * @description 支援艦隊の最大艦数
 */
const MAX_SHIP_SIZE = 6;

/**
 * @description 必須艦種名
 */
const ESSENCIAL_SHIP_NAME = "駆逐艦";

/**
 * @description 必須艦種の数
 */
const ESSENCIAL_SHIP_SIZE = 2;

// 駆逐艦2隻は支援艦隊に必須。
const ESSENCIAL_SHIPS = (() => {
    const essencialShip = new Ship({
        antisubmarine: false,
        shipType: new ShipType({typeName: ESSENCIAL_SHIP_NAME})
    });
    const ships = new Array(ESSENCIAL_SHIP_SIZE).fill(essencialShip);
    return ships;
})();

const getShipSpaceSize = () => MAX_SHIP_SIZE - ESSENCIAL_SHIPS.length;

class FleetError extends Error {
    constructor( {ships, message}) {
        super(message);
        this.ships = ships;
    }
}

class InvalidFleetError extends FleetError {
    constructor(ships) {
        const msg = [
            `支援艦隊に${ESSENCIAL_SHIP_NAME}が${ESSENCIAL_SHIPS.length}隻必須です。`,
            "引数の艦隊にこれらの艦が含まれていません。また組み込む余裕がありません。"
        ];
        const message = msg.join("");
        super({ships, message});
    }
}

class MissingShipsError extends FleetError {
    constructor() {
        const message = "支援艦隊に艦が存在しません。";
        super({ships: [], message});
    }
}

/**
 * @description 値が存在しなかった時にデフォルト値を返すMap
 */
class DefaultMap extends Map {
    constructor( {args = [], defaultValue}) {
        super(args);
        this.defaultValue = defaultValue;
    }

    get(key) {
        const value = super.get(key);
        if (value === undefined) {
            return this.defaultValue;
        } else {
            return value;
        }
    }
}

class Fleet {
    constructor( {ships = []} = {}) {
        const kuchikus = ships.filter(ship =>
            ship.shipType.typeName === ESSENCIAL_SHIP_NAME);
        if (kuchikus.length >= ESSENCIAL_SHIPS.length) {
            this.ships = ships;
        } else if (kuchikus.length < ESSENCIAL_SHIPS.length &&
            ships.length <= getShipSpaceSize()) {
            this.ships = ships.concat(ESSENCIAL_SHIPS);
        } else {
            throw new InvalidFleetError(ships);
        }
        const reducer = (acc, current) => {
            const count = acc.get(current);
            acc.set(current, count + 1);
            return acc;
        };
        const defaultValue = 0;
        this.shipTypeNames = this.ships.map(ship => ship.shipType.typeName)
            .reduce(reducer, new DefaultMap({defaultValue}));
        this.supportTypes = this.ships.map(ship => ship.shipType.supportType)
            .reduce(reducer, new DefaultMap({defaultValue}));
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

    /**
     * @description 戦艦系の数
     */
    get senkanCount() {
        const types = ["戦艦", "高速戦艦", "航空戦艦"];
        return this.getShipTypeCount(typeName => types.includes(typeName));
    }

    /**
     * @description 重巡系の数
     */
    get jyujyunCount() {
        const types = ["重巡洋艦", "航空巡洋艦"];
        return this.getShipTypeCount(typeName => types.includes(typeName));
    }

    /**
     * @description 対潜航空攻撃可能かどうか
     */
    get canAntiSubmarine() {
        const existAntiSubmarineKeibo = ship => {
            return ship.shipType.typeName === "軽空母" && ship.antisubmarine;
        };
        if (!this.ships.some(existAntiSubmarineKeibo)) {
            return false;
        }

        const antiSubmarinaCountMap = new DefaultMap({defaultValue: 0});
        this.ships.forEach(ship => {
            if (ship.antisubmarine) {
                const typeName = ship.shipType.typeName;
                const currentCount = antiSubmarinaCountMap.get(typeName);
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

    /**
     * @description 支援艦隊のタイプを調べて返す。
     * @todo 判定部分が煩雑である。SupportRuleなどの抽象的な層を取り入れて整理したい。
     */
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
                (asaCount >= 2 ||
                    asbCount >= 2)) {
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

const supportchecker = {
    Fleet, 
    Ship, 
    ShipType, 
    FleetError,
    InvalidFleetError,
    MissingShipsError,
    util: {
        runTest,
        loadConfig, 
        getShipSpaceSize
    }
};

export default supportchecker;

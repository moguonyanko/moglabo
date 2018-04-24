/**
 * @fileOverview 触接成功率計算用モジュール
 */

const AirState = {
    secure: "制空権確保",
    superiority: "航空優勢",
    inferior: "航空劣勢"
};

const AirStateStartingRate = {
    [AirState.secure]: 1.0,
    [AirState.superiority]: 0.6,
    [AirState.inferior]: 0.5 // TODO: 仮の値
};

const AirStateSelectingRate = {
    [AirState.secure]: 0.07,
    [AirState.superiority]: 0.06,
    [AirState.inferior]: 0.055
};

class Aircraft {
    constructor( {name = "", hit = 0, search = 0} = {}) {
        Object.assign(this, {name, hit, search});
    }
}

class Slot {
    constructor( {aircraft, carry = 0}) {
        Object.assign(this, {aircraft, carry});
    }

    getStartingProbability(airState) {
        if (!(airState in AirStateStartingRate)) {
            throw new TypeError(`${airState} is unsupported air state`);
        }
        const rate = AirStateStartingRate[airState];
        const value = 0.04 * this.aircraft.search * Math.sqrt(this.carry);
        return value * rate;
    }

    getSelectingProbability(airState) {
        if (!(airState in AirStateStartingRate)) {
            throw new TypeError(`${airState} is unsupported air state`);
        }
        const rate = AirStateSelectingRate[airState];
        const value = rate * this.aircraft.search;
        return value;
    }
}

const getStartingProbability = ({slots, airState}) => {
    return slots.map(sl => sl.getStartingProbability(airState))
        .reduce((acc, current) => acc + current, 0);
};

const getSelectingProbabilityMap = ({slots, airState}) => {
    return slots.reduce((acc, current) => {
        const hit = current.aircraft.hit;
        const probs = acc.get(hit) || [];
        probs.push(current.getSelectingProbability(airState));
        acc.set(hit, probs);
        return acc;
    }, new Map());
};

const getSelectingProbabilityOnHit = ({slots, airState, hit, probMap}) => {
    const pMap = probMap || getSelectingProbabilityMap({slots, airState});
    const probs = pMap.get(hit) || [];
    const anyProb = probs.map(p => 1 - p)
        .reduce((acc, current) => acc * current, 1);
    return 1 - anyProb;
};

const getSelectingProbability = ({slots, airState}) => {
    const hitValues = new Set(slots.map(slot => slot.aircraft.hit));
    const probMap = getSelectingProbabilityMap({slots, airState});
    const result = Array.from(hitValues)
        .map(hit => getSelectingProbabilityOnHit({slots, airState, hit, probMap}))
        .reduce((acc, probByHit) => acc + probByHit, 0);

    return result;
};

const getSampleSlots = () => {
    const zerokan = new Aircraft({
        name: "零観",
        hit: 2,
        search: 6
    }),
        siun = new Aircraft({
            name: "紫雲",
            hit: 1,
            search: 8
        }),
        yatei = new Aircraft({
            name: "夜偵",
            hit: 1,
            search: 3
        }),
        tenzanm = new Aircraft({
            name: "天山村田隊",
            hit: 2,
            search: 4
        }),
        kyunanat = new Aircraft({
            name: "九七艦攻友永隊",
            hit: 3,
            search: 4
        }),
        tenzant = new Aircraft({
            name: "天山友永隊",
            hit: 3,
            search: 5
        }),
        ryuseikai = new Aircraft({
            name: "流星改",
            hit: 0,
            search: 2
        });

    const sl1 = new Slot({
        aircraft: zerokan,
        carry: 7
    }),
        sl2 = new Slot({
            aircraft: siun,
            carry: 7
        }),
        sl3 = new Slot({
            aircraft: yatei,
            carry: 4
        }),
        sl4 = new Slot({
            aircraft: tenzanm,
            carry: 34
        }),
        sl5 = new Slot({
            aircraft: kyunanat,
            carry: 21
        }),
        sl6 = new Slot({
            aircraft: kyunanat,
            carry: 12
        }),
        sl7 = new Slot({
            aircraft: tenzant,
            carry: 34
        }),
        sl8 = new Slot({
            aircraft: tenzanm,
            carry: 24
        }),
        sl9 = new Slot({
            aircraft: ryuseikai,
            carry: 12
        });

    const slots = [sl1, sl2, sl3, sl4, sl5, sl6, sl7, sl8, sl9];

    return slots;
};

const getRevisedStartingProbability = ({slots, airState}) => {
    const prob = getStartingProbability({slots, airState});
    if (prob > 1.0) {
        return 1.0;
    } else {
        return prob;
    }
};

const getProbability = ({slots, airState}) => {
    const startProb = getRevisedStartingProbability({slots, airState});
    const selectProb = getSelectingProbability({slots, airState});
    return startProb * selectProb;
};

const getProbabilityOnHit = ({slots, airState, hit}) => {
    const startProb = getRevisedStartingProbability({slots, airState});
    const selectProb = getSelectingProbabilityOnHit({slots, airState, hit});
    return startProb * selectProb;
};

const testGetStartingProbability = () => {
    const expected = 1.671;
    const ac1 = new Aircraft({
        name: "零式水上観測機",
        hit: 2,
        search: 6
    });
    const sl1 = new Slot({
        aircraft: ac1,
        carry: 3
    });
    const sl2 = new Slot({
        aircraft: ac1,
        carry: 3
    });
    const ac2 = new Aircraft({
        name: "二式艦上偵察機",
        hit: 1,
        search: 7
    });
    const sl3 = new Slot({
        aircraft: ac2,
        carry: 9
    });

    const slots = [sl1, sl2, sl3];
    const actual = getStartingProbability({slots, airState: AirState.secure});

    if (Math.abs(actual - expected) > 0.001) {
        throw new Error(`Expected=${expected} but Actual=${actual}`);
    }
};

const testGetSelectingProbability = () => {
    const expected = 0.663;
    const slots = getSampleSlots();
    const actual = getSelectingProbabilityOnHit({
        slots,
        airState: AirState.secure,
        hit: 3
    });

    if (Math.abs(actual - expected) > 0.001) {
        throw new Error(`Expected=${expected} but Actual=${actual}`);
    }
};

const runTest = () => {
    testGetStartingProbability();
    testGetSelectingProbability();

    const slots = getSampleSlots(),
        airState = AirState.secure,
        hit = 3;
    console.log(`命中問わず触接が成功する確率=${getProbability({slots, airState})}`);
    console.log(`命中${hit}の機体が触接を担当する確率=${getProbabilityOnHit({slots, airState, hit})}`);

    console.log("OK");
};

const shokusetu = {
    AirState,
    Aircraft,
    Slot,
    getStartingProbability,
    getRevisedStartingProbability,
    getSelectingProbabilityOnHit,
    getProbability,
    getProbabilityOnHit,
    test: {
        runTest
    }
};

export default shokusetu;

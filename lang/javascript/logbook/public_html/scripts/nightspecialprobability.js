((win, doc, math) => {
    "use strict";
    
    const cutinTypeNames = {
        "gyorai": "魚雷カットイン",
        "hourai": "砲雷カットイン",
        "shuhou": "主砲カットイン"
    };
    
    const luckCaps = {
        [cutinTypeNames.gyorai]: 60,
        [cutinTypeNames.hourai]: 70,
        [cutinTypeNames.shuhou]: 55
    };
    
    const luckBases = {
        [cutinTypeNames.gyorai]: 70,
        [cutinTypeNames.hourai]: 70,
        [cutinTypeNames.shuhou]: 50
    };
    
    const probabilityCapsOfFlagship = {
        [cutinTypeNames.gyorai]: 77,
        [cutinTypeNames.hourai]: 83,
        [cutinTypeNames.shuhou]: 65
    };
    
    const probabilityCaps = {
        [cutinTypeNames.gyorai]: 65,
        [cutinTypeNames.hourai]: 65,
        [cutinTypeNames.shuhou]: 50
    };
    
    class Revision {
        constructor({exceedableLuck = false, value = 0}) {
            this.exceedableLuck = exceedableLuck;
            this.value = value;
        }
    }
    
    const getRevisionValue = ({luck, luckCap, revision}) => {
        if (revision.exceedableLuck || luck <= (luck + luckCap)) {
            return revision.value;
        } else {
            if (luck >= luckCap) {
                return 0;
            } else {
                return luckCap - luck;
            }
        }
    };
    
    const getProbability = ({luck = 0, cutinType, revisions = []}) => {
        if (!(cutinType in luckBases)) {
            throw new Error(`${cutinType} is unsupported`);
        } 
        const luckBase = luckBases[cutinType];
        const luckCap = luckCaps[cutinType]; 
        const revisionValue = revisions.map(revision => getRevisionValue({
            luck, luckCap, revision
        })).reduce((r1, r2) => r1 + r2, 0);
        const probability = math.sqrt(luckBase * luck) + revisionValue;
        return probability;
    };
    
    const testCalc = () => {
        const luck = 23;
        const cutinType = cutinTypeNames.gyorai;
        const tanshoutou = new Revision({
            exceedableLuck: true,
            value: 5
        });
        const shoumeidan = new Revision({
            exceedableLuck: true,
            value: 5
        });
        const flagship = true;
        const kikan = new Revision({
            exceedableLuck: false,
            value: 12.5
        });
        const revisions = [
            tanshoutou, shoumeidan, kikan
        ];
        const result = getProbability({ luck, cutinType, revisions });
        const probCap = flagship ? probabilityCapsOfFlagship[cutinType] : 
                probabilityCaps[cutinType];
        return result < probCap ? result : probCap;
    };
    
    const init = () => {
        const result = testCalc();
        console.log(`カットイン発動率は ${result} ％`);
    };
    
    win.addEventListener("DOMContentLoaded", init);
})(window, document, Math);
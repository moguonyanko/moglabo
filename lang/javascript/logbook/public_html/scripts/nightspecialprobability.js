((win, doc, math) => {
    "use strict";
    
    let cutinTypes, revisions;
    
    const MAX_PROPABILITY = 99;
    
    class Revision {
        constructor({name = "", value = 0}) {
            this.name = name;
            this.value = value;
        }
        toString() {
            const msgs = [
                `補正種別名:${this.name}`,
                `補正値=${this.value}`
            ];
            return msgs.join(",");
        }
    }
    
    class CutinType {
        constructor({name = "", luckCap = 0, luckBase = 0}) {
            this.name = name;
            this.luckCap = luckCap;
            this.luckBase = luckBase;
        }
        toString() {
            return `${this.name}:運キャップ=${this.luckCap}:基底値=${this.luckBase}`;
        }
    }
    
    const getProbability = ({luck = 0, cutinType, revisions = []}) => {
        const luckBase = cutinType.luckBase;
        const luckCap = cutinType.luckCap; 
        const sumOfRevisionValues = revisions
                .map(revision => revision.value)
                .reduce((r1, r2) => r1 + r2, 0);
        const adjustedLuck = luck < luckCap ? luck : luckCap;
        const probability = math.sqrt(luckBase * adjustedLuck) + sumOfRevisionValues;
        return probability < MAX_PROPABILITY ? probability : MAX_PROPABILITY;
    };
    
    const loadConfigObjects = async ({path, entryName, initializer}) => {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Failed loading config:${path}`);
        }
        const config = await response.json();
        const objs = Object.entries(config[entryName]).map(entry => {
            return {
                [entry[0]]: new initializer(entry[1])
            };
        }).reduce((o1, o2) => Object.assign(o1, o2), {});
        return objs;
    };
    
    const loadRevisions = async () => {
        const revisions = await loadConfigObjects({
            path: "../../config/nightrevision.json",
            entryName: "revisions",
            initializer: Revision
        });
        return revisions;
    };
    
    const loadCutinTypes = async () => {
        const cutinTypes = await loadConfigObjects({
            path: "../../config/cutintype.json",
            entryName: "cutinTypes",
            initializer: CutinType
        });
        return cutinTypes;
    };
    
    // DOM
    
    const getLuck = () => {
        const ele = doc.querySelector(".luck");
        return parseInt(ele.value);
    };
    
    const getSelectedRevisions = () => {
        const eles = doc.querySelectorAll(".revision");
        const selectedRevisions = Array.from(eles)
                .filter(ele => ele.checked)
                .map(ele => revisions[ele.value]);
        return selectedRevisions;
    };
    
    const getSelectedCutinType = () => {
        const eles = doc.querySelectorAll(".cutin");
        const selectedEles = Array.from(eles).filter(ele => ele.checked);
        if (selectedEles.length > 0  && selectedEles[0].value in cutinTypes) {
            return cutinTypes[selectedEles[0].value];
        } else {
            throw new Error("Not selected or invalid cutin type");
        }
    };
    
    const getSpecialProbability = () => {
        const result = getProbability({ 
            luck: getLuck(), 
            cutinType: getSelectedCutinType(), 
            revisions: getSelectedRevisions(revisions) 
        });
        return result;
    };
    
    const addListeners = () => {
        const runner = doc.querySelector(".runner"),
            output = doc.querySelector(".output");
        runner.addEventListener("click", () => {
            const probability = getSpecialProbability(revisions);
            output.innerHTML = math.round(probability);
        });    
    };
    
    const testCalc = () => {
        const luck = 75;
        const cutinType = cutinTypes.gyorai;
        const tanshoutou = new Revision({
            exceedableLuck: true,
            value: 5
        });
        const shoumeidan = new Revision({
            exceedableLuck: true,
            value: 5
        });
        const kikan = new Revision({
            exceedableLuck: false,
            value: 12.5
        });
        const revisions = [
            tanshoutou, shoumeidan, kikan
        ];
        const result = getProbability({ luck, cutinType, revisions });
        console.log(`カットイン発動率は ${result} ％`);
    };
    
    const init = async () => {
        cutinTypes = await loadCutinTypes();
        revisions = await loadRevisions();
        addListeners();
        //console.log(cutinTypes);
        //console.log(revisions);
        //testCalc();
    };
    
    win.addEventListener("DOMContentLoaded", init);
})(window, document, Math);
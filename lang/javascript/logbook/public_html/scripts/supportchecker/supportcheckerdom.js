// importするモジュールの名前はdefault exportした時の名前と一致していなくても良い。
import SC from "../../scripts/supportchecker/supportchecker.js";

const EVENT_TARGET_PREFIX = "lb-event-";

const CLASS_NAMES = {
    shipSelect: `${EVENT_TARGET_PREFIX}ship-selector`,
    antiSubmarineCheck: "antisubmarine-enable",
    antiSubmarineLabel: "antisubmarine-enable-label",
    shipSubContainer: "ship-sub-container",
    shipBase: "ship-base",
    result: "result",
    inputSection: "input-section",
    runner: `${EVENT_TARGET_PREFIX}runner`
};

const createShipSelector = config => {
    const reducer = (acc, current) => {
        acc.appendChild(current);
        return acc;
    };

    const opts = Object.entries(config).map(entry => {
        const opt = document.createElement("option");
        opt.setAttribute("value", JSON.stringify(entry));
        opt.appendChild(document.createTextNode(entry[0]));
        return opt;
    }).reduce(reducer, document.createDocumentFragment());

    const sel = document.createElement("select");
    sel.setAttribute("class", CLASS_NAMES.shipSelect);
    const initialOp = document.createElement("option");
    initialOp.setAttribute("selected", "selected");
    sel.appendChild(initialOp);
    sel.appendChild(opts);
    return sel;
};

const createShipChecker = () => {
    const checker = document.createElement("input");
    checker.setAttribute("type", "checkbox");
    checker.setAttribute("class", CLASS_NAMES.antiSubmarineCheck);
    const label = document.createElement("label");
    label.setAttribute("class", CLASS_NAMES.antiSubmarineLabel);
    label.appendChild(checker);
    label.appendChild(document.createTextNode("対潜航空攻撃可能"));
    return label;
};

const createShipContainer = config => {
    const container = document.createDocumentFragment();
    const spaceSize = SC.util.getShipSpaceSize();
    for (let i = 0; i < spaceSize; i++) {
        const subContainer = document.createElement("div");
        subContainer.setAttribute("class", CLASS_NAMES.shipSubContainer);
        const sel = createShipSelector(config);
        const checker = createShipChecker();
        subContainer.appendChild(sel);
        subContainer.appendChild(checker);
        container.appendChild(subContainer);
    }
    return container;
};

const initPage = config => {
    const base = document.querySelector(`.${CLASS_NAMES.shipBase}`);
    const shipContainer = createShipContainer(config);
    base.appendChild(shipContainer);
};

const createCheckFleet = () => {
    const subContainers = document.querySelectorAll(`.${CLASS_NAMES.shipSubContainer}`);
    const ships = Array.from(subContainers).map(subContainer => {
        const sel = subContainer.querySelector(`.${CLASS_NAMES.shipSelect}`);
        const selectedValue = sel.value;
        if (selectedValue) {
            const shipInfo = JSON.parse(selectedValue);
            const antisubmarine =
                subContainer.querySelector(`.${CLASS_NAMES.antiSubmarineCheck}`).checked;
            const ship = new SC.Ship({
                antisubmarine,
                shipType: new SC.ShipType({
                    typeName: shipInfo[0],
                    supportType: shipInfo[1]
                })});
            return ship;
        } else {
            return null;
        }
    }).filter(ship => ship !== null);

    return new SC.Fleet({ships});
};

const diplaySupportType = () => {
    const result = document.querySelector(`.${CLASS_NAMES.result}`);
    try {
        const fleet = createCheckFleet();
        result.innerHTML = fleet.support;
    } catch (err) {
        result.innerHTML = err.message;
    }
};

const changeAntiSubmarineChecker = target => {
    // まだ艦種が選択されていない時は空文字になっている。
    if (!target.value) {
        return;
    }
    // changeイベント経由でイベントリスナーにイベントが通知された場合でなくても
    // selectのvalueを取得することはできる。
    // ただしinput要素を含むdiv要素など直接の操作の対象でない要素はtargetにならない。
    const value = JSON.parse(target.value);
    const shipTypeName = value[0];
    // TODO: parentNodeなどNodeの親子関係に依存したコードは避けた方がよい。
    // 親子関係を破壊するサードパーティ製ライブラリと組み合わせた場合正常に動作しなくなる。
    const parent = target.parentNode;
    const checker = parent.querySelector(`.${CLASS_NAMES.antiSubmarineCheck}`);
    // 海防艦の場合、対潜航空攻撃可能かどうかは問われない。(そもそも航空攻撃不可能)
    if (shipTypeName === SC.shipTypeNames.KAIBOU) {
        checker.setAttribute("disabled", "disabled");
    } else {
        checker.removeAttribute("disabled");
    }
};

const updatePage = (target) => {
    const classList = target.classList;
    if (classList.contains(CLASS_NAMES.runner)) {
        diplaySupportType();
    } else if (classList.contains(CLASS_NAMES.shipSelect)) {
        changeAntiSubmarineChecker(target);
    }
};

const eventListener = event => {
    const className = event.target.getAttribute("class");
    if (className && className.startsWith(EVENT_TARGET_PREFIX)) {
        event.stopPropagation();
        updatePage(event.target);
    }
};

const addListener = () => {
    const subject = document.querySelector(`.${CLASS_NAMES.inputSection}`);
    const options = {
        passive: true // preventDefaultを呼び出すことはない。
    };
    subject.addEventListener("mouseup", eventListener, options);
    subject.addEventListener("touchend", eventListener, options);
    // AndroidのChromeやiOSのSafariではchangeイベントに対して
    // リスナーを登録しないとselect要素で選択された値を取得できない。
    // touchendイベントがselect要素から値を取得できるタイミングよりも
    // 早く発生してしまうためである。
    subject.addEventListener("change", eventListener, options);
};

const main = async () => {
    try {
        SC.util.runTest();
        const config = await SC.util.loadConfig();
        initPage(config);
        addListener();
    } catch (err) {
        console.error(err.message);
    }
};

// main関数をexportして外部から呼び出すのでもいいがimport及びexportに対応していない
// ブラウザで動作しなくなってしまう。
// async functionはawaitを指定せずに呼び出すとPromiseが返るのだが、
// 以下のmain呼び出しではthen()を呼び出さずmain()だけでも正しい結果が得られてしまう。
//main().then();
window.addEventListener("DOMContentLoaded", async () => {
    await main();
});

// Promiseのエラーの取りこぼしを防ぐ。
window.addEventListener("unhandledrejection", err => {
    console.log(err);
    console.error(err.message);
});

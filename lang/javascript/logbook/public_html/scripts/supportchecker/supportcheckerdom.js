import supportchecker from "../../scripts/supportchecker/supportchecker.js";

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
    sel.setAttribute("class", "ship-selector");
    const initialOp = document.createElement("option");
    initialOp.setAttribute("selected", "selected");
    sel.appendChild(initialOp);
    sel.appendChild(opts);
    return sel;
};

const createShipChecker = () => {
    const checker = document.createElement("input");
    checker.setAttribute("type", "checkbox");
    checker.setAttribute("class", "antisubmarine-enable");
    const label = document.createElement("label");
    label.appendChild(checker);
    label.appendChild(document.createTextNode("対潜航空攻撃可能"));
    return label;
};

const createShipContainer = config => {
    const container = document.createDocumentFragment();
    const spaceSize = supportchecker.util.getShipSpaceSize();
    for (let i = 0; i < spaceSize; i++) {
        const subContainer = document.createElement("div");
        subContainer.setAttribute("class", "ship-sub-container");
        const sel = createShipSelector(config);
        const checker = createShipChecker();
        subContainer.appendChild(sel);
        subContainer.appendChild(checker);
        container.appendChild(subContainer);
    }
    return container;
};

const initPage = config => {
    const base = document.querySelector(".ship-base");
    const shipContainer = createShipContainer(config);
    base.appendChild(shipContainer);
};

const createCheckFleet = () => {
    const subContainers = document.querySelectorAll(".ship-sub-container");
    const ships = Array.from(subContainers).map(subContainer => {
        const sel = subContainer.querySelector(".ship-selector");
        const selectedValue = sel.value;
        if (selectedValue) {
            const shipInfo = JSON.parse(selectedValue);
            const antisubmarine =
                subContainer.querySelector(".antisubmarine-enable").checked;
            const ship = new supportchecker.Ship({
                antisubmarine,
                shipType: new supportchecker.ShipType({
                    typeName: shipInfo[0],
                    supportType: shipInfo[1]
                })});
            return ship;
        } else {
            return null;
        }
    }).filter(ship => ship !== null);

    return new supportchecker.Fleet({ships});
};

const shipListener = event => {
    if (event.target.classList.contains("lb-event-runner")) {
        event.stopPropagation();
        const result = document.querySelector(".result");
        try {
            const fleet = createCheckFleet();
            result.innerHTML = fleet.support;
        } catch (err) {
            result.innerHTML = err.message;
        }
    }
};

const addListener = () => {
    const base = document.querySelector(".input-section");
    const options = {
        passive: true // preventDefaultを呼び出すことはない。
    };
    base.addEventListener("mouseup", shipListener, options);
    base.addEventListener("touchend", shipListener, options);
};

const main = async () => {
    try {
        //supportchecker.util.runTest();
        const config = await supportchecker.util.loadConfig();
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

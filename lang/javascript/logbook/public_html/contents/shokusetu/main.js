/**
 * @fileOverview 触接計算システム構築スクリプト
 * ユーザー側
 */

import shoku from "./shokusetu.js";
import elt from "./element.js";

const MAX_SLOT_SIZE = 28;

const getProbMap = () => {
    const slotElements = document.querySelectorAll("ac-slot");
    const slots = Array.from(slotElements).map(slotElement => {
        const {hit, search} = {
            hit: slotElement.getAttribute("hit"),
            search: slotElement.getAttribute("search")
        };
        const carry = slotElement.getAttribute("carry");
        const aircraft = new shoku.Aircraft({hit, search});
        const slot = new shoku.Slot({aircraft, carry});
        return slot;
    });
    const airState = document.querySelector("air-state").getAttribute("airstate");
    return shoku.getProbabilityMapOnHit({slots, airState});
};

const getResultArea = () => document.querySelector(".resultarea");

const clearResultArea = () => getResultArea().innerHTML = "";

const displayProbMap = pMap => {
    clearResultArea();
    const resultArea = getResultArea();
    const resultFragment = Array.from(pMap.keys()).sort().map(hit => {
        const hitEl = document.createElement("p");
        hitEl.appendChild(document.createTextNode(`命中${hit}の機体の触接成功率:`));
        const valEl = document.createElement("strong");
        const value = (pMap.get(hit) * 100).toFixed(1);
        valEl.appendChild(document.createTextNode(value));
        hitEl.appendChild(valEl);
        return hitEl;
    }).reduce((acc, current) => {
        acc.appendChild(current);
        return acc;
    }, document.createDocumentFragment());
    resultArea.appendChild(resultFragment);
};

const getSlotSize = () => document.querySelectorAll("ac-slot").length;

const updateProbs = () => {
    const pMap = getProbMap();
    displayProbMap(pMap);
};

const addListener = () => {
    document.querySelector(".addslot").addEventListener("click", event => {
        if (getSlotSize() >= MAX_SLOT_SIZE) {
            return;
        }
        const container = document.querySelector(".slotcontainer");
        const acSlot = document.createElement("ac-slot");
        const removeButton = document.createElement("button");
        removeButton.appendChild(document.createTextNode("削除"));
        removeButton.onclick = () => {
            acSlot.parentNode.removeChild(acSlot);
            updateProbs();
        };
        removeButton.setAttribute("slot", "option");
        acSlot.appendChild(removeButton);
        container.appendChild(acSlot);
    });

    const slotContainer = document.querySelector(".slotcontainer");
    slotContainer.addEventListener("change", event => {
        if (event.target.tagName.toLowerCase() === "ac-slot") {
            event.stopPropagation();
            updateProbs();
        }
    });

    document.querySelector("air-state").addEventListener("change", event => {
        event.stopPropagation();
        const pMap = getProbMap();
        updateProbs();
    })
};

const init = () => {
    shoku.test.runTest();
    customElements.define("ac-slot", elt.SlotElement);
    customElements.define("air-state", elt.AirStateElement);
    addListener();
};

window.addEventListener("DOMContentLoaded", init);
window.addEventListener("unhandledrejection", err => console.error(err));

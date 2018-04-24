import shoku from "./shokusetu.js";

class SlotElement extends HTMLElement {
    constructor() {
        super();
        
        // TODO: implement
    }
}

const init = () => {
    shoku.test.runTest();
};

window.addEventListener("DOMContentLoaded", init);

const elt = {
    SlotElement
};

export default elt;
    
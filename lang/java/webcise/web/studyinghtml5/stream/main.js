import sm from "./stream.js";

const main = () => {
    customElements.define("simple-image-stream", sm.element.SimpleImageStream);
    customElements.define("custom-number-stream", sm.element.CustomNumberStream);
};

window.addEventListener("DOMContentLoaded", main);

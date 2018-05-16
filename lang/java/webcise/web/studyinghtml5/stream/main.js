import sm from "./stream.js";

const main = () => {
    customElements.define("simple-image-stream", sm.element.SimpleImageStream);
};

window.addEventListener("DOMContentLoaded", main);

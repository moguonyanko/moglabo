((window, document) => {
    "use strict";

    const init = () => {
        const greeing = document.querySelector("main .search");
        const search = location.search;
        greeing.innerHTML = search;
    };

    window.addEventListener("DOMContentLoaded", init);
})(window, document);

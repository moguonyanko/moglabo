// ==UserScript==
// @name TW script
// ==/UserScript==

((window, document) => {
    "use strict";

    if (location.origin !== "https://twitter.com") {
        return;
    }

    console.log("My script loaded");
})(window, document);

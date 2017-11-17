// ==UserScript==
// @name TW script
// @description Twitter utility script
// @namespace https://twitter.com
// @include https://twitter.com/*
// @version 1.0
// ==/UserScript==

((window, document) => {
    "use strict";

    const setExcludeText = () => {
        const input = document.querySelector("div.txt:nth-child(5) > label:nth-child(1) > input:nth-child(2)");
        if (input) {
            // Input NG words
            input.value = "";
        }
    };
    
    const init = () => {
        setExcludeText();
        console.log("TW script loaded");
    };
    
    init();
})(window, document);

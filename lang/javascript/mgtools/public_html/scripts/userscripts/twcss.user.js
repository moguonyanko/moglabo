// ==UserScript==
// @name TW css script
// @description Twitter utility css
// @namespace https://twitter.com
// @include https://twitter.com/*
// @version 1.0
// ==/UserScript==

((window, document) => {
    "use strict";

    const setStyle = () => {
//        const link = document.createElement("link");
//        link.setAttribute("rel", "stylesheet");
//        link.setAttribute("href", "//localhost/mgtools/css/usercss/tw.user.css");
//        document.body.appendChild(link);

        const selectors = [
            ".dashboard-right",
            ".SidebarCommonModules",
            ".SearchNavigation-canopy",
            ".AdaptiveRelatedSearches",
            "#global-nav-search"            
        ];
        selectors.forEach(s => {
            const el = document.querySelector(s);
            if (el) {
                el.style.display = "none";
            }
        });
        
        const txt = document.querySelector("div.txt:nth-child(5) > label:nth-child(1) > input:nth-child(2)");
        if (txt) {
            txt.style.width = "1em";
        }
    };

    const init = () => {
        setStyle();
        console.log("TW style loaded");
    };
    
    init();
})(window, document);

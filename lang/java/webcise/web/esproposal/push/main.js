((window, document, navigator) => {
    "use strict";

    const sw = navigator.serviceWorker;
    
    const qs = (selector, element = document) => {
        return element.querySelector(selector);
    };
    
    const display = content => {
        qs(".info-area").innerHTML += content + "<br />";
    };

    const register = async () => {
        if (!sw) {
            return;
        }

        const url = "sw.js", scope = "./";
        const registration = await sw.register(url, {scope});
        const subscription = await registration.pushManager.subscribe();
        console.log(subscription);
        display(JSON.stringify(subscription));
        // TODO: pushイベントを発生させられていない。
        window.addEventListener("push", event => {
            console.log(event);
        });
    };

    const init = () => {
        qs(".register").addEventListener("click", 
            async () => { await register(); });
    };

    window.addEventListener("DOMContentLoaded", init);
})(window, document, navigator);

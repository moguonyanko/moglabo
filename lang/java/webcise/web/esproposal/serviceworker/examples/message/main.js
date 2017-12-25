((window, document) => {
    "use strict";

    const sw = navigator.serviceWorker;

    const register = async () => await sw.register("./sw.js", {scope: "./"});

    const request = async url => {
        const response = await fetch(url);
        return await response.json();
    };

    window.addEventListener("DOMContentLoaded", async () => {
        const reg = document.querySelector(".register"),
            unreg = document.querySelector(".unregister"),
            ld = document.querySelector(".load"),
            res = document.querySelector(".result");

        reg.addEventListener("click", async () => {
            const regist = await register();
            unreg.addEventListener("click", () => regist && regist.unregister());
        });

        ld.addEventListener("click", async () => {
            const json = await request("./sample.json");
            res.innerHTML += `${JSON.stringify(json)}<br />`;
        });

        // TODO: messageイベントが発生しない。
        sw.addEventListener("message", event => {
            const {url, message} = event.data;
            res.innerHTML += `${url}: ${message}<br />`;
        });
    });
})(window, document);
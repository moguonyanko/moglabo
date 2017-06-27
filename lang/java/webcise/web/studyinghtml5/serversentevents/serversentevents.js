((win, doc, g) => {
    "use strict";
    
    const noop = () => {};
    const base = "basic-sample";
    const q = selector => doc.querySelector("." + base + " " + selector);
    
    const resultArea = q(".result-area"),
        runner = q(".runner"),
        closer = q(".closer"),
        clearer = q(".clearer");
    
    const getText = txt => doc.createTextNode(txt);
    const display = txt => resultArea.innerHTML += txt;
    const clear = () => resultArea.innerHTML = "";
    const log = txt => console.log(txt);
    
    const getContextName = () => {
        const url = new URL(win.location.href);
        const paths = url.pathname.split("/");
        return paths[1] || "";
    };
    
    const getSenderUrl = (name = "ServerSender") => {
        return "/" + getContextName() + "/" + name;
    };
    
    const onopen = evt =>  {
        log(evt);
    };
    
    const onmessage = evt =>  {
        log(evt);
        const json = JSON.parse(evt.data);
        display(json);
    };
    
    const onclose = evt =>  {
        log(evt);
    };
    
    const addListener = () => {
        let eventSource = null;
    
        runner.addEventListener("click", () => {
            const url = getSenderUrl();
            eventSource = new EventSource(url);
            Object.assign(eventSource, { onopen, onmessage, onclose });
        });

        closer.addEventListener("click", () => {
            if (eventSource) {
                eventSource.close();
            }
        });
        
        clearer.addEventListener("click", clear);
    };
    
    const init = () => {
        addListener();
    };
    
    win.addEventListener("DOMContentLoaded", init);
})(window, document, goma);

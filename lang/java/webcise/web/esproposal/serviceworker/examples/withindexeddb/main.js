const sw = navigator.serviceWorker;

const swListener = async classList => {
    if (classList.contains("register")) {
        await sw.register("./sw.js", {scope: "./"});
    } else if (classList.contains("unregister")) {
        const reg = await sw.ready;
        reg && reg.unregister();
    } else if (classList.contains("update")) {
        const reg = await sw.ready;
        reg && reg.update();
    } else {
        // Does nothing
    }
};

const getImageObject = async url => {
    const res = await fetch(url);
    return await res.blob();
};

const listener = async event => {
    const classList = event.target.classList;
    if (classList.contains("appinput")) {
        event.stopPropagation();
    } else {
        return;
    }
    if (classList.contains("swcontrol")) {
        await swListener(classList);
    } else {
        const container = document.querySelector(".imagecontainer");
        if (classList.contains("download")) {
            const blob = await getImageObject("yellowarrow.png");
            const url = window.URL.createObjectURL(blob);
            const img = document.createElement("img");
            img.className = "sampleimage";
            img.onload = () => {
                window.URL.revokeObjectURL(blob);
                container.appendChild(img);
            };
            img.src = url;
        } else if (classList.contains("clear")) {
            const imgs = container.querySelectorAll(".sampleimage");
            Array.from(imgs).forEach(img => img.parentNode.removeChild(img));
        }
    }
};

const addListener = () => {
    const base = document.querySelector(".controlpanel");
    // デフォルトはpassive=trueのはず。
    base.addEventListener("mouseup", listener);
    base.addEventListener("touchend", listener);
};

const init = async () => {
    addListener();
};

window.addEventListener("DOMContentLoaded", init);

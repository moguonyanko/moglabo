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

const getImageContainer = () => document.querySelector(".imagecontainer");

const sampleImageClassName = "sampleimage";

const appendImage = blob => {
    const url = window.URL.createObjectURL(blob);
    const img = document.createElement("img");
    img.className = sampleImageClassName;
    img.onload = () => {
        window.URL.revokeObjectURL(blob);
        getImageContainer().appendChild(img);
    };
    img.src = url;
};

const clearImage = () => {
    const imgs = getImageContainer().querySelectorAll(`.${sampleImageClassName}`);
    Array.from(imgs).forEach(img => img.parentNode.removeChild(img));
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
        if (classList.contains("download")) {
            const blob = await getImageObject("yellowarrow.png");
            appendImage(blob);
        } else if (classList.contains("clear")) {
            clearImage();
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

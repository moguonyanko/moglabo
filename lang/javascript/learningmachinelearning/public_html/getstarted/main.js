import predict from "./predict.js";

window.addEventListener("DOMContentLoaded", async () => {
    const result = await predict();
    
    const jsonResult = document.querySelector(".json");
    const json = document.createTextNode(JSON.stringify(result));
    jsonResult.appendChild(json);
    
    const toStringResult = document.querySelector(".toString");
    const str = document.createTextNode(result.toString());
    toStringResult.appendChild(str);
    
    const dataResult = document.querySelector(".data");
    const data = document.createTextNode(await result.data());
    dataResult.appendChild(data);
});

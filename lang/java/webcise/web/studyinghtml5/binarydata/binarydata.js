((win, doc, g) => {
    "use strict";
    
    const getTypedArray = ({ size = 0, offset = 0, value = 0, littleEndian = false } = {}) => {
        let buffer = new ArrayBuffer(size);
        new DataView(buffer).setInt32(offset, value, littleEndian);
        let array = new Int32Array(buffer);
        return array;
    };
    
    // Page construction
    
    const select = selector => doc.querySelector(selector);
    const display = (target, content) => target.innerHTML += content + "<br />"; 
    const clear = target => target.innerHTML = "";
    
    const getArrayBufferSize = () => {
        return select(".buffer-size").value;
    };
    
    const getDataViewOffset = () => {
        return select(".dataview-offset").value;
    };
    
    const getDataViewValue = () => {
        return select(".dataview-value").value;
    };
    
    const isLittleEndian = () => {
        return select(".endian").checked;
    };
    
    const addListener = () => {
        const base = ".endian-sample ";
        const runner = select(base + ".runner");
        const clearer = select(base + ".clearer");
        const result = select(base + ".result");
        
        runner.addEventListener("click", () => {
            const size = getArrayBufferSize(), 
                offset = getDataViewOffset(),
                value = getDataViewValue(),
                littleEndian = isLittleEndian();
            const array = getTypedArray({ size, offset, value, littleEndian });
            display(result, array.toString());            
        });
        
        clearer.addEventListener("click", () => clear(result));
    };
    
    const init = () => {
        addListener();
    };
    
    win.addEventListener("DOMContentLoaded", init);
})(window, document, goma);

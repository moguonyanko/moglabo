/**
 * @fileoverview Geolocation API調査用スクリプト
 */

const gl = navigator.geolocation;

const pm = navigator.permissions ||
    { query() { return { state: 'granted' }; } }

const defaultOption = {
    enableHighAccuracy: true,
    timeout: 3000,
    maximumAge: 0
};

const turnMillisecond = option => {
    const target = Object.assign({}, option);
    if ('timeout' in option) {
        target.timeout *= 1000;
    }
    if ('maximumAge' in option) {
        target.maximumAge *= 1000;
    }
    return target;
};

const getCurrentPos = option => {
    const op = option ? turnMillisecond(option) : defaultOption;
    return new Promise((resolve, reject) => {
        gl.getCurrentPosition(pos => {
            // PositionにもCoordinatesにもtoJSONが実装されていないので、
            // そのままJSON.stringifyを適用すると空のJSONが返されてしまう。
            const p = Object.assign(pos.coords, {
                toJSON() {
                    return {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                        accuracy: pos.coords.accuracy
                    };
                }
            })
            resolve(p);
        }, reject, op);
    });
};

const permitGeolocation = async () => {
    const result = await pm.query({ name: 'geolocation' });
    return result.state !== 'denied';
};

// DOM

const modifyParam = value => {
    if (value === 'on') {
        return true;
    } else if (value === 'off') {
        return false;
    } else {
        const v = parseFloat(value);
        if (!isNaN(v)) {
            return v;
        } else {
            return value;
        }
    }
};

const getGeolocationOption = root => {
    const params = root.querySelectorAll('.param');
    const option = Array.from(params)
        .filter(ele => ele.hasAttribute('data-param-type'))
        .map(ele => {
            return { [ele.dataset.paramType]: modifyParam(ele.value) }
        })
        .reduce((acc, current) => Object.assign(acc, current), {});
    return option;
};

const listeners = {
    async getCurrentPosition(root) {
        const output = root.querySelector('.output');
        if (!(await permitGeolocation())) {
            output.innerHTML = 'GPS使用権限なし';
            return;
        }
        try {
            const option = getGeolocationOption(root);
            const pos = await getCurrentPos(option);
            output.innerHTML = JSON.stringify(pos, null, 4);
        } catch (err) {
            output.innerHTML = err.message;
        }
    }
};

window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.example').forEach(root => {
        root.addEventListener('pointerup', async event => {
            const t = event.target.dataset.eventListener;
            if (typeof listeners[t] !== 'function') {
                return;
            }
            event.stopPropagation();
            await listeners[t](root);
        });
    });
});

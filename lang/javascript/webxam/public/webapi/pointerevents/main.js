/**
 * @fileoverview Pointer Events調査用スクリプト
 */

const createPointerEventsResult = event => {
  const {
    altitudeAngle,
    azimuthAngle,
    tiltX,
    tiltY
  } = event;
  const result = document.createElement('div');
  result.innerHTML = `
  <p>altitudeAngle = ${altitudeAngle}</p>
  <p>azimuthAngle = ${azimuthAngle}</p>
  <p>tiltX = ${tiltX}</p>
  <p>tiltY = ${tiltY}</p>
  `;
  return result;
};

const listeners = {
  dump: event => {
    console.log(event);
    const output = event.target.parentNode.querySelector('.output');
    const result = createPointerEventsResult(event);
    if (typeof output.replaceChildren === 'function') {
      output.replaceChildren(result);
    } else {
      output.innerHTML = '';
      output.appendChild(result);
    }
  }
};

const addListener = () => {
  const main = document.querySelector('main');
  main.addEventListener('pointerup', event => {
    const { eventTarget } = event.target.dataset;
    listeners[eventTarget]?.(event);
  });
};

addListener();

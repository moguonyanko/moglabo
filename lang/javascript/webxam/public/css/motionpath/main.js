/**
 * @fileoverview CSS Motion Path調査用スクリプト
 */

const paths = {
  path() {
    return `path('M0,0 L200,200 L400,30 L100,300z')`;
  },
  ray() {
    return `ray(45deg closest-side contain)`;
  },
  circle() {
    return `circle(50% at 25% 25%)`;
  },
  polygon() {
    return `polygon(25% 0%, 50% 25%, 100% 50%, 50% 100%, 25% 50%, 0% 25%)`;
  },
  inset() {
    return `inset(50% 50% 50% 50%)`;
  },
  url() {
    return `url(#samplepath1)`;
  },
  strokeBox() {
    return 'stroke-box';
  },
  marginBox() {
    return 'margin-box';
  },
  none() {
    return 'none';
  }
};

const createRadio = ({ name, value, defaultValue = 'none' }) => {
  const label = document.createElement('label');
  const input = document.createElement('input');
  input.setAttribute('type', 'radio');
  input.setAttribute('data-event-target', 'offsetPathAction');
  input.setAttribute('name', 'offsetpath');
  input.setAttribute('value', value);
  if (value === defaultValue) {
    input.setAttribute('checked', 'checked');
  }
  label.appendChild(input);
  label.appendChild(document.createTextNode(name));
  return label;
};

const initActionSelector = () => {
  const actionEle = Object.keys(paths)
    .map(name => createRadio({ name, value: name }))
    .reduce((acc, current) => {
      acc.appendChild(current); return acc;
    }, document.createDocumentFragment());
    document.querySelector('.action').appendChild(actionEle);
};

const setAction = ({ value }) => {
  const target = document.querySelector('.target');
  target.style.offsetPath = paths[value]();
};

const listeners = {
  offsetPathAction({ value }) {
    setAction({ value });
  }
};

const addListener = () => {
  document.querySelectorAll('section').forEach(section => {
    section.addEventListener('click', event => {
      const { value, dataset } = event.target;
      const et = dataset.eventTarget;
      if (typeof listeners[et] !== 'function') {
        return;
      }
      event.stopPropagation();
      listeners[et]({ value });
    })
  });
};

initActionSelector();
addListener();

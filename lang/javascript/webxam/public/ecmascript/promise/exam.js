/**
 * @fileOverview Promise調査用スクリプト
 */

const doService = async url => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request Error!: ${response.status}`);
  }
  const json = await response.json();
  return json;
};

const loadImage = async path => {
  const res = await fetch(path);
  if (res.ok) {
    return await res.blob();
  } else {
    throw new Error(`Failed loading image: ${res.statusText}`);
  }
};

// DOM

const funcs = {
  async resolvePromise(root) {
    const value = root.querySelector('.resolve-value').value;
    const json = await doService('/webxam/service/hello');
    const ps = [
      Promise.resolve(value),
      Promise.resolve(json.value),
      Promise.resolve(value)
    ];
    const results = await Promise.all(ps);
    const output = root.querySelector('.output');
    output.innerHTML += results.join('<br />');
  },
  // 成功時も失敗時も同じ関数を呼び出す必要がある場合にfinallyは有効。
  loadImageSuccess(root) {
    const output = root.querySelector('.output');
    loadImage('test.png').then(b => {
      const img = new Image();
      img.onload = () => {
        output.appendChild(img);
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(b);
    }).finally(() => {
      output.appendChild(document.createTextNode('SUCCESS!'));
    });
  },
  loadImageFail(root) {
    const output = root.querySelector('.output');
    loadImage('notfound.png').catch(err => {
      output.appendChild(document.createTextNode(err.message));
    }).finally(() => {
      output.appendChild(document.createTextNode('FAILED!'));
    });
  }
};

const addListener = () => {
  Array.from(document.querySelectorAll('section.example')).forEach(root => {
    root.addEventListener('pointerup', async event => {
      const et = event.target.dataset.eventTarget;
      if (et) {
        event.stopPropagation();
        if (typeof funcs[et] === 'function') {
          await funcs[et](root);
        }
      }
    });
  });
};

window.addEventListener('DOMContentLoaded', () => {
  addListener();
});

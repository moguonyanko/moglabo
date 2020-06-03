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

const getObjectFromResponse = (response, type = 'json') => {
  if (response.ok) {
    if (typeof response[type] === 'function') {
      return response[type]();
    } else {
      return Promise.reject(new Error(`invalid type: ${type}`));
    }
  } else {
    return Promise.reject(new Error(`request error: ${response.status}`));
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
  },
  async allSettledPromises(root) {
    const output = root.querySelector('.output');
    const promises = [
      fetch('shops.json'),
      fetch('notfound_members.json'),
      fetch('members.json')
    ];
    // 成功・失敗関係なく全てのPromiseを実行しその結果をまとめて返す。
    const results = await Promise.allSettled(promises);
    // HTTPエラーが発生した場合でもstatusはfulfilledになってしまう。
    // 従ってResponseのokプロパティの確認は必須である。
    const successResponses = results.filter(r => r.status === 'fulfilled')
                                    .map(r => r.value)
                                    .filter(res => res.ok);
    successResponses.forEach(async response => {
      const json = await response.json();
      output.innerHTML += `${JSON.stringify(json)}<br />`;
    });                                
  },
  executeAnyPromises: async root => {
    const output = root.querySelector('.output');
    const promises = [
      fetch('notfound_members.json').then(getObjectFromResponse),
      fetch('shops.json').then(getObjectFromResponse),
      fetch('members.json').then(getObjectFromResponse)
    ];
    try {
      // Promise.anyを使ってもリクエスト数を減らすことはできない。
      // 全てのPromiseが実行され最初に成功したPromiseの結果だけが返される。
      const json = await Promise.any(promises);
      output.value = JSON.stringify(json); 
    } catch(err) {
      // Promise.any内でErrorがスローされ全てのPromiseがrejectされた場合、
      // 内部でAggregateErrorが生成されてスローされる。
      const message = [
        `${err.name}`,
        `${err.message}`,
        `実際にスローされた例外=${err.errors}`
      ];
      output.value = message.join('\n');
    }
  }
};

const addListener = () => {
  const examples = document.querySelectorAll('section.example');
  Array.from(examples).forEach(root => {
    root.addEventListener('click', async event => {
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

addListener();

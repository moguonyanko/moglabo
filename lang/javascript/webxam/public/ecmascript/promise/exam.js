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

// 参考:
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/from
const makeRangeNumbers = ({ start = 0, end, step = 1 }) => {
  return Array.from({
    length: ((end - start) / step) + 1
  }, (value, index) => start + (index * step));
};

const getSumPromise = array => {
  return array.map(v => Promise.resolve(v))
    .reduce((acc, current) => {
      //console.log(current);
      return acc.then(x => current.then(y => x + y));
    });
};

const runTest = async () => {
  const sampleArray = makeRangeNumbers({ end: 10 });
  console.log(sampleArray);
  const chainedPromise = getSumPromise(sampleArray);
  // const promises = sampleArray.map(v => Promise.resolve(v));
  // const result = await Promise.all(promises).then(sum);
  console.log(await chainedPromise);
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
    } catch (err) {
      // Promise.any内でErrorがスローされ全てのPromiseがrejectされた場合、
      // 内部でAggregateErrorが生成されてスローされる。
      const message = [
        `${err.name}`,
        `${err.message}`,
        `実際にスローされた例外=${err.errors}`
      ];
      output.value = message.join('\n');
    }
  },
  chainPromise: async () => {
    const [ start, end ] = [
      parseInt(document.querySelector('.array-start').value),
      parseInt(document.querySelector('.array-end').value)
    ];
    const sampleArray = makeRangeNumbers({ start, end });
    const chainedPromise = getSumPromise(sampleArray);
    const result = await chainedPromise;
    const output = document.querySelector('.output.chainPromise');
    output.textContent = result;
  },
  doPromiseTry: () => {
    const funcs = [
      () => 'Sync Function',
      () => { throw new Error('Sync Error') },
      async () => 'Async Function',
      async () => { throw new Error('Async Error') }
      // 上の2つの関数と同じ。
      // async () => await Promise.resolve('Async Function'),
      // async () => await Promise.reject(new Error('Async Error'))
    ]

    const output = document.querySelector('.output.PromiseTry'),
      useTry = document.querySelector('.useTry').checked

    const tryPromise = func => {
      Promise.try(func)
        .then(result => output.innerHTML += `try then...${result}<br />`)
        .catch(error => output.innerHTML += `try catch...${error}<br />`)
        .finally(() => output.innerHTML += 'Try Finished<br />')
    }

    const noTryPromise = func => {
      // Promise.try()と同じことをする。new Promise(func)やnew Promise(func)では
      // 非同期関数を渡された時にthenやcatthで処理することができない。
      // これを分かりやすくしたのがPromise.try()である。
      new Promise(resolve => resolve(func()))
        // new Promise(func, func)
        .then(result => output.innerHTML += `no try then...${result}<br />`)
        .catch(error => output.innerHTML += `no catch...${error}<br />`)
        .finally(() => output.innerHTML += 'No Try Finished<br />')
    }

    /**
     * Promise.tryは引数の関数が同期・非同期どちらの方法で結果を返してくるかに関係なく
     * 処理することができる。
     */
    funcs.forEach(func => {
      if (useTry) {
        tryPromise(func)
      } else {
        noTryPromise(func)
      }
    })
  },
  clearPromiseTry: () => {
    document.querySelector('.output.PromiseTry').innerHTML = ''
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

const main = async () => {
  await runTest();
  addListener();
};

main().then();

/**
 * @fileoverview EventLoop調査用スクリプト(Server)
 * 参考:
 * https://nodejs.org/en/docs/guides/dont-block-the-event-loop/
 */

/* eslint-disable no-undef */

const sumBy = ({ max, start = 1 }) => {
  return new Promise((resolve, reject) => {
    let s = 0;

    if (max < start) {
      reject(new Error(`Max parameter must be over ${start}`))
      return;
    }

    const func = current => {
      s += current;
      if (current === max) {
        resolve(s);
        return;
      }
      // 非同期処理の再帰
      // 単純なループではEventLoopをブロックする可能性がある。
      setImmediate(func.bind(null, current + 1));
    };

    func(start);
  });
};

const avg = async ({ max, start }) => {
  const s = await sumBy({ max, start });
  return s / (max - start + 1);
};

class EventTestLoop {
  constructor() { }

  redos({ query }) {
    const path = query.path;
    const result = { path };
    // EventLoopがブロックされる恐れがある危険な正規表現
    const dengerReg = /(\/.+)+$/;
    if (path.match(dengerReg)) {
      result.status = 200;
    } else {
      result.status = 400;
    }
    return JSON.stringify(result);
  }

  async average({ query }) {
    const max = parseInt(query.max),
      start = parseInt(query.start);
    const result = {};
    try {
      const value = await avg({ max, start });
      result.value = value;
    } catch (err) {
      result.value = err.message;
    }
    return JSON.stringify(result);
  }
}

// eslint-disable-next-line no-unused-vars
const runTest = () => {
  const el = new EventTestLoop;
  el.average({ query: { max: 10, start: 10 } })
    .then(v => console.log(v));
};

//runTest();

module.exports = EventTestLoop;

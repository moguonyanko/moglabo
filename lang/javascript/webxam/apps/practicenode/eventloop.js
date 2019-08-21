/**
 * @fileoverview EventLoop調査用スクリプト(Server)
 * 参考:
 * https://nodejs.org/en/docs/guides/dont-block-the-event-loop/
 */

/* eslint-disable no-undef */

class EventTestLoop {
  constructor () {}

  redos ({query}) {
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
}

module.exports = EventTestLoop;

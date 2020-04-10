/**
 * @fileoverview Workerからクロスオリジンでリクエストを行うサンプル
 * Workerからリクエストする場合でもメインのスクリプトから行う場合と振る舞いは同じ。
 * Safariではサイト越えトラッキングが無効化されている場合はサードパーティCookieを
 * 送信できない。
 */

const crossOriginRequest = async () => {
  const url = 'https://myhost/webxam/apps/practicenode/cookie/sampleuser';
  const response = await fetch(url, {
    mode: "cors",
    credentials: "include"
  });
  const json = await response.json();
  return json;
};

self.onmessage = async () => {
  const json = await crossOriginRequest();
  self.postMessage(json);
};

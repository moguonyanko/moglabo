/**
 * @fileoverview PushEventを調べるためにServiceWorkerを読み込むスクリプトです。
 * ServiceWorkerをサポートしていないブラウザは非対応です。
 */

import config from './config.json' with { type: "json" }

const outputMessage = (message, obj = '') => {
  const outputElement = document.querySelector('main .output')
  if (outputElement) {
    outputElement.innerHTML += `${message}`
    if (obj) {
      outputElement.innerHTML += `:${obj}<br />`
    } else {
      outputElement.innerHTML += `<br />`
    }
  }
  if (obj instanceof Error) {
    console.error(obj)
  } else {
    console.log(message, obj)
  }
}

const urlBase64ToUint8Array = base64String => {
  // URL Safe の '-' と '_' を、標準 Base64 の '+' と '/' に置換
  const base64 = base64String
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  // パディングの処理（自動的に '=' を追加）
  let padding = '';
  while ((base64.length + padding.length) % 4 !== 0) {
    padding += '='
  }

  const base64Padded = base64 + padding

  // window.atob() を使ってデコード
  // ここで InvalidCharacterError が発生しないか確認
  const rawData = atob(base64Padded)

  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const subscribe = async registration => {
  const options = {
    userVisibleOnly: true, // 全てのプッシュメッセージで通知が表示されることを示す。
    // 実運用時はサーバーから得た有効な鍵を使う。
    // 開発時であっても適当な文字列ではregistration.pushManager.subscribeでエラーになる。
    applicationServerKey: urlBase64ToUint8Array(config.applicationServerKey)
  }

  try {
    const subscription = await registration.pushManager.subscribe(options)
    outputMessage('ユーザー購読成功', subscription)
  } catch (err) {
    outputMessage('ユーザー購読失敗', err)
    if (Notification.permission === 'denied') {
      outputMessage('プッシュ通知はブロックされました。')
    }
  }
}

const clickListeners = {
  clearOutput: () => {
    const outputElement = document.querySelector('main .output')
    if (outputElement) {
      outputElement.innerHTML = ''
    }
  }
}

const addListener = () => {
  const main = document.querySelector('main')
  main.addEventListener('click', event => {
    const { eventListener } = event.target.dataset
    clickListeners[eventListener]?.()
  })

  navigator.serviceWorker.addEventListener('message', event => {
    const { data } = event
    outputMessage(data)
  })
}

const init = async () => {
  addListener()

  try {
    const registration = await navigator.serviceWorker.register('serviceworker.js')
    outputMessage('Service Worker 登録成功', registration)

    subscribe(registration)
  } catch (err) {
    outputMessage('Service Worker 登録失敗', err)
  }
}

init().then()

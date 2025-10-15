/**
 * @fileoverview PushEventを調べるためにServiceWorkerを読み込むスクリプトです。
 * ServiceWorkerをサポートしていないブラウザは非対応です。
 */

const log = (text, obj = '') => {
  const outputElement = document.querySelector('main .output')
  if (outputElement) {
    outputElement.innerHTML += `${text}<br />${obj}<br />`
  }
  if (obj instanceof Error) {
    console.error(obj)
  } else {
    console.log(text, obj)
  }
}

const urlBase64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const subscribe = async registration => {
  const applicationServerKey = 'BPh2QG6B4yLgQ3GzN8lA4n2nO0j0y5q9M7e8j9q7p1o4k0m6l8n1m0o5p3r1t9w0x2y4z6a8b1c3d5e7f'

  const options = {
    userVisibleOnly: true, // 全てのプッシュメッセージで通知が表示されることを示す。
    // 実運用時はサーバーから得た有効な鍵を使う。
    // 開発時であっても適当な文字列ではregistration.pushManager.subscribeでエラーになる。
    applicationServerKey: urlBase64ToUint8Array(applicationServerKey)
  }

  try {
    const subscription = await registration.pushManager.subscribe(options)
    log('ユーザー購読成功:', subscription)
  } catch (err) {
    log('ユーザー購読失敗:', err)
    if (Notification.permission === 'denied') {
      log('プッシュ通知はブロックされました。')
    }
  }
}

const init = async () => {
  try {
    const registration = await navigator.serviceWorker.register('sw.js')
    log('Service Worker 登録成功:', registration)

    subscribe()
  } catch (err) {
    log('Service Worker 登録失敗:', err)
  }
}

init().then()

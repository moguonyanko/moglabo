/**
 * PushEventが発生したときの処理を記述します。
 * PushEventオブジェクトは、サーバーから送られたデータを含んでいます。
 */
const pushListener = event => {
  console.log('[Service Worker] プッシュ通知を受信しました。')
  console.log(`[Service Worker] PushEventオブジェクト:`, event)

  const pushData = event.data ? event.data.text() : ''
  console.log(`[Service Worker] ペイロード（データ）: ${pushData}`)

  // データがない場合のデフォルト値
  let title = '新しい通知'
  let body = pushData

  try {
    // データがJSON形式の場合、解析してタイトルと本文を取り出す
    const data = JSON.parse(pushData)
    title = data.title || title
    body = data.body || body
  } catch (e) {
    // JSON形式ではない場合は、そのまま本文として使用
  }

  const options = {
    body: body,
    icon: '/image/sampleblock.png', // 通知に表示されるアイコンのパス
    badge: '/image/hello.png', // モバイルで通知数を示すバッジ
    vibrate: [200, 100, 200], // バイブレーションパターン
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2',
      url: 'https://localhost/webxam/webapi/pushevent/' // 通知クリック時に開きたいURLなど
    }
  }

  // event.waitUntil() は、通知の表示が完了するまでサービスワーカーをアクティブに保ちます。
  // これが PushEvent を非同期で処理するための重要な手順です。
  const notificationPromise = self.registration.showNotification(title, options)

  // waitUntil() に Promise を渡すことで、その Promise が解決されるまで
  // Service Worker が停止するのを防ぎます。
  event.waitUntil(notificationPromise)
}

const addListener = () => {
  self.addEventListener('push', pushListener)

  // 通知がクリックされたときの処理
  self.addEventListener('notificationclick', event => {
    console.log('[Service Worker] 通知がクリックされました。')
    event.notification.close() // クリックされた通知を閉じる

    // クリック時のアクションを非同期で実行
    const clickActionPromise = clients.openWindow(event.notification.data.url || '/')

    event.waitUntil(clickActionPromise)
  })

  // Service Worker のインストール時
  self.addEventListener('install', event => {
    console.log('[Service Worker] インストールされました')
  })

  // Service Worker の有効化時
  self.addEventListener('activate', event => {
    console.log('[Service Worker] 有効化されました')
  })
}

const init = () => {
  addListener()
}

init()

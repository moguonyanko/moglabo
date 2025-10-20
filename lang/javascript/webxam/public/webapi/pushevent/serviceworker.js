/**
 * PushEventが発生したときの処理を記述します。
 * PushEventオブジェクトは、サーバーから送られたデータを含んでいます。
 */

/**
 * SercieWorkerからメインスレッドにメッセージを送信する関数
 * @param {string} message メッセージ本文
 * @return {Promise<void>}
 */
const sendMessageToMain = async message => {
  // Service Workerが制御している全てのクライアント（タブ）を取得
  const clients = await self.clients.matchAll({
    includeUncontrolled: true,
    type: 'window'
  })
  if (clients && clients.length) {
    // 見つかったすべてのクライアントにメッセージを送信
    clients.forEach(client => {
      client.postMessage(message)
    })
  }
}

const pushListener = event => {
  sendMessageToMain('[Service Worker] プッシュ通知を受信しました。')
  console.log(`[Service Worker] PushEventオブジェクト:`, event)

  const pushData = event.data ? event.data.text() : ''
  sendMessageToMain(`[Service Worker] ペイロード（データ）: ${pushData}`)

  // データがない場合のデフォルト値
  let title = '新しい通知'
  let body = pushData

  try {
    // データがJSON形式の場合、解析してタイトルと本文を取り出す
    const data = JSON.parse(pushData)
    title = data.title || title
    body = data.body || body
  } catch (e) {
    // レスポンスがJSON形式でないなどの理由によりJSON解析に失敗した場合は
    // そのままテキストを本文として使用する。
  }

  const options = {
    body,
    icon: '/webxam/image/sampleicon.png', // 通知に表示されるアイコンのパス
    badge: '/webxam/image/samplebadge.png', // モバイルで通知数を示すバッジ
    vibrate: [200, 100, 200], // バイブレーションパターン
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2',
      // 通知クリック時に開きたいURLなど
      // ひとまずこのserviceworker.jsを読み込んだページを指定している。
      url: 'https://localhost/webxam/webapi/pushevent/'
    }
  }

  /**
   * @todo PushEventの後に通知を試みているがブラウザ上に表示されない。
   * 調査中。
   */

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
    sendMessageToMain('[Service Worker] 通知がクリックされました。')
    event.notification.close() // クリックされた通知を閉じる

    // クリック時のアクションを非同期で実行
    const clickActionPromise = clients.openWindow(event.notification.data.url || '/')

    event.waitUntil(clickActionPromise)
  })

  // Service Worker のインストール時
  self.addEventListener('install', event => {
    sendMessageToMain('[Service Worker] インストールされました')
  })

  // Service Worker の有効化時
  self.addEventListener('activate', event => {
    sendMessageToMain('[Service Worker] 有効化されました')
  })
}

const init = () => {
  addListener()
}

init()

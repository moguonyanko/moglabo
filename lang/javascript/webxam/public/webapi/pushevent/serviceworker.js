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
  // 現在のServiceWorkerによって制御されているクライアントのみを取得する。
  // 照合するクライアントはwindow（規定値）とする。
  const clients = await self.clients.matchAll({
    type: 'window'
  })
  // 見つかった全てのクライアントにメッセージを送信
  clients.forEach(client => {
    client.postMessage(message)
  })
}

const pushListener = event => {
  sendMessageToMain('[Service Worker] プッシュ通知を受信しました。')
  console.log(`[Service Worker] PushEventオブジェクト:`, event)

  const pushData = event.data ? event.data.text() : ''
  sendMessageToMain(`[Service Worker] ペイロード（データ）: ${pushData}`)

  // データがない場合のデフォルト値
  let title = '通知テスト'
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
      // 通知クリック時に開きたいURL
      url: '/webxam/webapi/pushevent/nortification.html'
    }
  }

  /**
   * @todo PushEventの後に通知を試みているが通知ポップアップがブラウザ上に表示されない。
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

  // 通知ポップアップがクリックされたときの処理
  self.addEventListener('notificationclick', event => {
    event.notification.close() // クリックされた通知ポップアップを閉じる
    event.waitUntil(
      clients.matchAll({ type: "window" }).then(clientList => {
        sendMessageToMain('[Service Worker] 通知がクリックされました。')
        for (const client of clientList) {
          // 既に開かれているウィンドウがあればそれをフォーカスする
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus()
          }
        }
        // 開かれているウィンドウがなければ新しく開く
        return clients.openWindow(event.notification.data.url)
      })
    )
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

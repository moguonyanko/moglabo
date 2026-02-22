/**
 * @fileoverview Navigation APIを試すためのスクリプトです。
 * 参考:
 * https://web.dev/blog/baseline-navigation-api?hl=en&authuser=3
 */

const fetchPageContent = async url => {
  const response = await fetch(url.pathname)
  if (!response.ok) {
    const detail = `fetch error:${response.status}:${await response.text()}`
    window.dispatchEvent(new CustomEvent('fetcherror', { detail }))
    return
  }
  const html = await response.text()
  return html
}

const renderContent = async content => {
  const rendaringArea = document.getElementById('rendering-area')
  rendaringArea.innerHTML = content
  // 履歴をページのルートに戻しておくことでリロードされてもSPAの断片だけ表示されるのは防げる。
  // ただしユーザーが進む、戻るをした時に意図しない結果を表示してしまうかもしれないので好ましくない。
  // history.replaceState(null, '', '/')
}

const navigationListeners = {
  simpleNavigate: event => {
    const url = new URL(event.destination.url)

    // URLが更新される。
    // 更新後の状態でリロードすると更新先URLのコンテンツだけが表示された状態になってしまう。
    // サーバー側でリロードされた状況に応じて適切にファイルを返すような調整をするのが妥当か。
    event.intercept({
      async handler() {
        const content = await fetchPageContent(url)
        await renderContent(content)
      }
    })
  },
  navigateWithTransition: event => {
    const url = new URL(event.destination.url)

    event.intercept({
      async handler() {
        const content = await fetchPageContent(url)
        // トランジションの表現を伴ってページ更新される。
        document.startViewTransition(async () => {
          await renderContent(content)
        })
      }
    })
  }
}

const getNavigationName = event => {
  // 戻るでページが表示された時event.sourceElementは未定義になっている。
  return event.sourceElement?.dataset?.navigationName
}

const addListeners = () => {
  navigation.addEventListener('navigate', event => {
    console.log(event)
    if (event.canIntercept) {
      const navigationName = getNavigationName(event)
      if (navigationName) {
        // navigattionListeners[navigator]が関数かどうかのチェックをするより
        // 呼び出して問題がある場合は即エラーにしてしまった方が良い。
        navigationListeners[navigationName](event)
      }
    }
  })

  document.querySelector('main').addEventListener('click', event => {
    const { navigationName } = event.target.dataset
    if (navigationName && !event.target.hasAttribute('href')) {
      //これだと断片のページに丸ごと遷移してしまう。
      navigation.navigate('./dashboard.html')
    }
  })

  window.addEventListener('fetcherror', err => {
    alert(err.message)
  })
}

addListeners()

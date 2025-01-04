/**
 * @fileoverview MPAのページ遷移を試すためのスクリプト
 * 参考:
 * https://developer.mozilla.org/ja/docs/Web/API/View_Transition_API/Using#javascript_%E3%82%92%E6%B4%BB%E7%94%A8%E3%81%97%E3%81%9F%E7%8B%AC%E8%87%AA%E3%81%AE%E6%96%87%E6%9B%B8%E9%96%93_mpa_%E9%81%B7%E7%A7%BB
 * https://developer.mozilla.org/ja/docs/Web/API/Window/pageswap_event
 */
/* eslint-disable no-undef */

const init = () => {
  /**
   * pagerevealは遷移先のページが最初にレンダリングされたときに発生する。
   * pagerevealイベントはa要素をクリックしてページ遷移した時だけでなく
   * ブラウザの戻る、進むボタンを押した時も発生する。
   */
  window.addEventListener("pagereveal", async event => {
    if (!navigation.activation.from) {
      return
    }

    if (event.viewTransition) {
      const fromUrl = new URL(navigation.activation.from.url)
      const currentUrl = new URL(navigation.activation.entry.url)

      const urlInfo = document.getElementById('pagereveal')
      urlInfo.innerHTML = `
      <p>pagereveal FROM: ${fromUrl}</p>
      <p>pagereveal CURRENT: ${currentUrl}</p>
      `

      await event.viewTransition.ready
      // ページ遷移のアニメーションが始まろうとしている状態
      const figcaption = document.querySelector('figcaption')
      figcaption.textContent = 'pagereveal ready'
    }
  })

  /**
   * pageswapはpagerevealより先に発生する。ページ遷移する直前に何か行いたい場合は
   * pageswapを使う。たとえば遷移前にユーザーへ確認する場合などである。
   */
  window.addEventListener("pageswap", async event => {
    if (event.viewTransition) {
      const currentUrl = event.activation.from?.url
        ? new URL(event.activation.from.url)
        : null
      const targetUrl = new URL(event.activation.entry.url)
      const urlInfo = document.getElementById('pageswap')
      urlInfo.innerHTML = `
      <p>pageswap CURRENT: ${currentUrl}</p>
      <p>pageswap TARGET: ${targetUrl}</p>
      `}

      await event.viewTransition.finished
      // ページ遷移のアニメーションが完了し新しいページをユーザーが操作可能になっている状態
      // ViewTransition.finishedはViewTransition.readyよりは後の状態を示す。
      const figcaption = document.querySelector('figcaption')
      figcaption.textContent = 'pageswap finished'
    })
}

init()

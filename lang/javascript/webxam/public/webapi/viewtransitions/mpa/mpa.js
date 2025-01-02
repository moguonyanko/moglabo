/**
 * @fileoverview MPAのページ遷移を試すためのスクリプト
 * 参考:
 * https://developer.mozilla.org/ja/docs/Web/API/View_Transition_API/Using#javascript_%E3%82%92%E6%B4%BB%E7%94%A8%E3%81%97%E3%81%9F%E7%8B%AC%E8%87%AA%E3%81%AE%E6%96%87%E6%9B%B8%E9%96%93_mpa_%E9%81%B7%E7%A7%BB
 */
/* eslint-disable no-undef */

const init = () => {
  /**
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
      console.log(fromUrl, currentUrl)

      const urlInfo = document.getElementById('urlInfo')
      urlInfo.innerHTML = `
      FROM: ${fromUrl}<br />
      CURRENT: ${currentUrl}
      `
    }
  })
}

init()

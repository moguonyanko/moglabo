/**
 * @fileoverview ストリーミングによるコンテンツ部分更新を試すためのサンプルスクリプト
 * 参考:
 * https://developer.chrome.com/blog/declarative-partial-updates?hl=ja#a_new_set_of_static_and_streaming_apis
 */

const loadFuncs = {
  staticSetContent: async () => {
    const contentElement = document.querySelector('.sethtml-container')
    const url = 'content.html'
    const response = await fetch(url)
    const html = await response.text()
    contentElement.setHTML(html)
  },
  streamSetContent: async () => {
    const contentElement = document.querySelector('.stream-container')
    const url = 'content.html'
    const response = await fetch(url)

    try {
      response.body.pipeThrough(new TextDecoderStream())
        .pipeTo(contentElement.streamHTMLUnsafe())
    } catch (e) {
      contentElement.setHTML(`<p>${e.message}</p>`)
    }
  }
}

window.addEventListener('load', () => {
  Object.values(loadFuncs).forEach(async func => await func())
})

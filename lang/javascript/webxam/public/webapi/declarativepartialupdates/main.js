/**
 * @fileoverview ストリーミングによるコンテンツ部分更新を試すためのサンプルスクリプト
 * 参考:
 * https://developer.chrome.com/blog/declarative-partial-updates?hl=ja#a_new_set_of_static_and_streaming_apis
 */

const requestContent = async () => {
  const url = 'content.html'
  const response = await fetch(url)
  return response
}

const getContent = async () => {
  const response = await requestContent()
  const html = await response.text()
  return html
}

// DOM

const loadFuncs = {
  staticSetContent: async () => {
    const contentElement = document.querySelector('.sethtml-container')
    const html = await getContent()
    contentElement.setHTML(html)
  },
  streamSetContent: async () => {
    const contentElement = document.querySelector('.stream-container')
    const response = await requestContent()

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

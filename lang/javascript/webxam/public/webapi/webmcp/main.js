/**
 * @fileoverview WebMCPのAPIを調べるためのスクリプトです。
 * 参考:
 * https://developer.chrome.com/docs/ai/webmcp/imperative-api?hl=ja
 */

const toolsUrls = [
  'https://github.com/' // sample url
]

const onClicks = {
  getTools: async () => {
    const output = document.querySelector('.example.get-tools .output ')
    const sameOriginTools = await document.modelContext.getTools()

    const crossOriginTools = await document.modelContext.getTools({
      fromOrigins: toolsUrls
    })

    const tools = sameOriginTools.concat(crossOriginTools)
    output.textContent = JSON.stringify(tools)
  }
}

const addListener = () => {
  const main = document.querySelector('main')
  main.addEventListener('click', async event => {
    const evTarget = event.target
    const { eventListener } = evTarget.dataset
    if (typeof onClicks[eventListener] === 'function') {
      try {
        evTarget.setAttribute('disabled', 'disabled')
        await onClicks[eventListener]()
      } finally {
        evTarget.removeAttribute('disabled')
      }
    }
  })
}

const init = () => {
  addListener()
}

init()

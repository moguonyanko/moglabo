/**
 * @fileoverview WebMCPのAPIを調べるためのスクリプトです。
 */

const onClicks = {
  getTools: async () => {
    const output = document.querySelector('.example.get-tools .output ')
    const tools = await document.modelContext.getTools()
    output.textContent = tools
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

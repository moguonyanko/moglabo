/**
 * @fileoverview forgeライブラリのサンプルコード
 */

const listeners = {
  onExecuteButtonClicked: async () => {
    const url = '/webxam/apps/practicenode/forge-inspection'

    const response = await fetch(url)
    const result = await response.json()

    const output = document.querySelector('.forge-sample .output')
    output.textContent = JSON.stringify(result)

  }
}

const init = () => {
  const main = document.querySelector('main')

  main.addEventListener('click', async event => {
    const { eventListener } = event.target.dataset
    if (typeof listeners[eventListener] === 'function') {
      try {
        event.target.setAttribute('disabled', 'true')
        await listeners[eventListener]()
      } finally {
        event.target.removeAttribute('disabled')
      }
    }
  })
}

init() 

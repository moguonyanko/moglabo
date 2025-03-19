/**
 * @fileoverview Gemini APIでテキスト生成するサンプル
 */

const listeners = {
  sendContents: async () => {
    const contents = document.querySelector('.simple-generation-text-sample .sample-text')
      .value
    if (!contents) {
      return
    }
    const response = await fetch(`/brest/genaiapi/generate/text/`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents
      })
    })
    if (!response.ok) {
      throw new Error(`ERROR: ${response.statusText}`)
    }
    const json = await response.json()
    const output = document.querySelector('.simple-generation-text-sample .output')
    output.textContent = json.results
  }
}

const init = () => {
  const main = document.querySelector('main')
  main.addEventListener('click', async event => {
    const { eventListener } = event.target.dataset
    await listeners[eventListener]?.()
  })
}

init()

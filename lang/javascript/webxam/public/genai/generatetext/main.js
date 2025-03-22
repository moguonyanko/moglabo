/**
 * @fileoverview Gemini APIでテキスト生成するサンプル
 */

// DOM

const listeners = {
  sendContents: async () => {
    const contents = document.querySelector('.simple-generation-text-sample .sample-text')
      .value
    if (!contents) {
      return
    }
    const response = await fetch('/brest/genaiapi/generate/text/', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents
      })
    })
    if (!response.ok) {
      throw new Error(`ERROR: ${response.statusText}`)
    }
    const output = document.querySelector('.simple-generation-text-sample .output')
    output.textContent = (await response.json()).text
  },
  sendImage: async () => {
    const contents = new FormData()
    const selectedFile = document.querySelector(".generation-text-by-image .selected-file")
    contents.append("file", selectedFile.files[0])
    const response = await fetch('/brest/genaiapi/generate/text-from-image/', {
      method: 'POST',
      body: contents
    })    
    const output = document.querySelector('.generation-text-by-image .output')
    output.textContent = (await response.json()).text
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

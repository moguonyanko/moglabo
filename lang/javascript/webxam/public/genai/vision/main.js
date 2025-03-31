/**
 * @fileoverview ビジョン機能のAPIを試すためのスクリプト
 */

const getTextFromUrl = async url => {
  const response = await fetch('/brest/genaiapi/generate/text-from-image-url/', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url
    })
  })
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message)
  }
  const { text } = await response.json()
  return text
}

// DOM

const listsners = {
  generateText: async () => {
    const url = document.getElementById('image-url').textContent
    const text = await getTextFromUrl(url)
    const output = document.querySelector('.generation-text-from-url .output')
    output.textContent = text
  },
  generateBbox: async () => {
    const contents = new FormData()
    const selectedFile = document.querySelector('.generate-bbox-from-image .selected-file')
    contents.append('file', selectedFile.files[0])
    const response = await fetch('/brest/genaiapi/generate/bouding-box-from-image/', {
      method: 'POST',
      body: contents
    })
    const output = document.querySelector('.generate-bbox-from-image .output')
    const json = await response.json()
    output.textContent = JSON.stringify(JSON.parse(json))
  }
}

const init = () => {
  document.body.addEventListener('click', async event => {
    const { eventListener } = event.target.dataset
    await listsners[eventListener]?.()
  })
}

init()

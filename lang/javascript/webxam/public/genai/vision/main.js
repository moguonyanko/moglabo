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
  }
}

const init = () => {
  document.body.addEventListener('click', async event => {
    const { eventListener } = event.target.dataset
    await listsners[eventListener]?.()
  })
}

init()

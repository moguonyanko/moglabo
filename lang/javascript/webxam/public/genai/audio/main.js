/**
 * @fileoverview 音声を理解する機能のAPIを試すためのスクリプト
 */

// DOM

const listsners = {
  sendShortAudio: async () => {
    const output = document.querySelector('.generation-text-from-short-audio .output')
    output.textContent = ''
    
    const contents = new FormData()
    const selectedFile = 
      document.querySelector('.generation-text-from-short-audio .selected-file')
    contents.append('file', selectedFile.files[0])
    const api_url = '/brest/genaiapi/generate/transcription-inline-from-audio/'
    const response = await fetch(api_url, {
      method: 'POST',
      body: contents
    })
    const text = await response.text()
    if (response.ok) {
      output.textContent = text
    } else {
      window.dispatchEvent(new CustomEvent('generationerror', {
        detail: text
      }))
    }
  }
}

const init = ({ listeners }) => {
  document.body.addEventListener('click', async event => {
    const { eventListener } = event.target.dataset
    await listsners[eventListener]?.()
  })
  window.addEventListener('generationerror', e => {
    alert(e.detail)
  })
}

init()

/**
 * @fileoverview ロボット工学系APIを確認するためのサンプルスクリプト
 */

const listeners = {
  detectObjects: async () => {
    const file = document.getElementById('selected-files')
    const targets = document.getElementById('targets').value.split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
    if (!file.files.length || targets.length <= 0) {
      return
    }
    const api_url = '/brest/genaiapi/generate/robotics/detect-objects'

    const formData = new FormData()
    for (let i = 0; i < file.files.length; i++) {
      formData.append('files', file.files[i])
    }
    formData.append('targets', JSON.stringify(targets))
    const response = await fetch(api_url, {
      method: 'POST',
      body: formData
    })
    const result = await response.json()
    const output = document.querySelector('.detect-objects-example .output')
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

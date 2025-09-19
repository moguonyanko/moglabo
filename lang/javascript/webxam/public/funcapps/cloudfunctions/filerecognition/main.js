/**
 * @fileoverview アップロードしたファイルを関数アプリによって認識させて
 * 解析したり、概要を取得したりするためのサンプルスクリプトです。
 */

const listeners = {
  onSummaryButtonClicked: async () => {
    const output = document.querySelector('.output')
    output.textContent = ''

    const url = 'https://localhost/mycloudfunctions/filerecognition/'
    const selectedFile = document.querySelector('.selected-file')

    const body = new FormData()
    for (let i = 0; i < selectedFile.files.length; i++) {
      body.append('files', selectedFile.files[i])
    }

    const response = await fetch(url, {
      method: 'POST',
      body
    })

    const { text } = await response.json()
    output.textContent = text
  }
}

const addListener = () => {
  document.body.addEventListener('click', async event => {
    const { eventListener } = event.target.dataset
    if (eventListener in listeners) {
      try {
        event.target.setAttribute('disabled', 'disabled')
        await listeners[eventListener]()
      } finally {
        event.target.removeAttribute('disabled')
      }
    }
  })
}

const init = () => {
  addListener()
}

init()

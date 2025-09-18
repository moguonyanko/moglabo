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

    const { text } = await response.text()
    console.log(text)

    output.textContent = text
  }
}

const addListener = () => {
  document.body.addEventListener('click', async event => {
    const { eventListener } = event.target.dataset
    if (eventListener in listeners) {
      await listeners[eventListener]()
    }
  })
}

const init = () => {
  addListener()
}

init()

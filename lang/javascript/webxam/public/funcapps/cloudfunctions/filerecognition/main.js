/**
 * @fileoverview アップロードしたファイルを関数アプリによって認識させて
 * 解析したり、概要を取得したりするためのサンプルスクリプトです。
 */

const listeners = {
  onSummaryButtonClicked: async () => {
    const url = 'https://localhost/mycloudfunctions/filerecognition/'
    const selectedFile = document.querySelector('.selected-file')

    const contents = new FormData()
    contents.append('file', selectedFile.files[0])
    const response = await fetch(url, {
      method: 'POST',
      body: contents
    })

    const text = await response.text()
    console.log(text)

    const output = document.querySelector('.output')
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

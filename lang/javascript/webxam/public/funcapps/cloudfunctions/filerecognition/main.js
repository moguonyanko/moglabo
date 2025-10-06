/**
 * @fileoverview アップロードしたファイルを関数アプリによって認識させて
 * 解析したり、概要を取得したりするためのサンプルスクリプトです。
 */

const viewSelectedImage = (target, file) => {
  const url = URL.createObjectURL(file)
  const img = new Image
  img.onload = () => {
    target.appendChild(img)
    URL.revokeObjectURL(url)
  }
  img.src = url
}

const changeListeners = {
  onSelectedFile: () => {
    const imgView = document.querySelector('.selected-file-image')
    imgView.innerHTML = ''

    const selectedFile = document.querySelector('.selected-file')
    for (let i = 0; i < selectedFile.files.length; i++) {
      viewSelectedImage(imgView, selectedFile.files[0])
    }
  }
}

const listeners = {
  onSummaryButtonClicked: async () => {
    const output = document.querySelector('.output')
    output.textContent = ''

    // ホストのnginx経由でホストあるいはDockerコンテナのCloudFunctionsを呼び出す場合
    // 開発環境ではnginxの設定をホスト上に集約したいので、こちらのURLで動作する状態が望ましい。
    const url = 'https://localhost/mycloudfunctions/filerecognition/'

    // nginxを経由することなく、ホストで起動したCloudFunctionsかDockerコンテナで起動している
    // CloudFunctionsを直接呼び出す場合
    // const url = 'http://localhost:10001/'

    // Dockderコンテナのnginx経由でDockerコンテナのCloudFunctionsを呼び出す場合
    // const url = 'http://localhost:8080/mycloudfunctions/filerecognition/'

    const selectedFile = document.querySelector('.selected-file')

    const body = new FormData()
    for (let i = 0; i < selectedFile.files.length; i++) {
      const file = selectedFile.files[i]
      body.append('files', file)
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

  document.body.addEventListener('change', event => {
    Object.values(changeListeners).forEach(listener => listener())
  })
}

const init = () => {
  addListener()
}

init()

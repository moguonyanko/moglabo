/**
 * @fileoverview アップロードしたファイルを関数アプリによって認識させて
 * 解析したり、概要を取得したりするためのサンプルスクリプトです。
 */

const viewSelectedImage = (imgView, file) => {
  if (!file) {
    imgView.innerHTML = ''
    return
  }
  const url = URL.createObjectURL(file)
  const img = new Image
  img.onload = () => {
    imgView.appendChild(img)
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
      viewSelectedImage(imgView, selectedFile.files[i])
    }
  }
}

const apiUrls = {
  /**
   * ホストのnginx経由でホストあるいはDockerコンテナのCloudFunctionsを呼び出す場合
   * 開発環境ではnginxの設定をホスト上に集約したいので、こちらのURLで動作する状態が望ましい。
   * つまりこのプロパティは「develop」相当となる。
   */
  useHostWebServer: 'https://localhost/mycloudfunctions/filerecognition/',
  /**
   * nginxを経由することなく、ホストで起動したCloudFunctionsかDockerコンテナで起動している
   * CloudFunctionsを直接呼び出す場合
   * 関数アプリの組み込みWebサーバを使って本番運用することは原則ない。
   * つまりこのプロパティも「develop」相当となる。
   */
  useFuncAppWebServer: 'http://localhost:10001/',
  /**
   * Dockderコンテナのnginx経由でDockerコンテナのCloudFunctionsを呼び出す場合
   * Dockerコンテナでnginxも動作させるマルチコンテナ管理は本番運用時を想定している。
   * つまりこのプロパティは「production」相当となる。
   */
  useContainerWebServer: 'http://localhost:8080/mycloudfunctions/filerecognition/'
}

const getWebServerMode = () => {
  const selectedModeEle = Array.from(document.getElementsByName('web-server-mode'))
    .filter(ele => ele.checked)[0]

  return selectedModeEle.value
}

const getApiUrl = () => {
  const serverMode = apiUrls[getWebServerMode()]
  if (serverMode) {
    return serverMode 
  } else {
    throw new Error(`${serverMode} is undefined`)
  }
}

const listeners = {
  onSummaryButtonClicked: async () => {
    const output = document.querySelector('.output')
    output.textContent = ''
    const selectedFile = document.querySelector('.selected-file')
    if (selectedFile.files.length === 0) {
      return
    }

    const body = new FormData()
    for (let i = 0; i < selectedFile.files.length; i++) {
      const file = selectedFile.files[i]
      body.append('files', file)
    }

    const response = await fetch(getApiUrl(), {
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

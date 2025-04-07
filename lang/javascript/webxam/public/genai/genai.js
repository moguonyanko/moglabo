/**
 * @fileoverview 生成AIのAPIを利用する上で共通の処理をまとめたスクリプト
 */

const requestByFileUpload = async ({ api_url, selectedFile }) => {
  const contents = new FormData()
  contents.append('file', selectedFile.files[0])
  const response = await fetch(api_url, {
    method: 'POST',
    body: contents
  })
  const text = await response.text()
  if (!response.ok) {
    window.dispatchEvent(new CustomEvent('generationerror', {
      detail: text
    }))
  }
  return text
}

const commonErrorHandler = e => {
  alert(e.detail)  
}

const initPage = ({ listeners, errrorHandler = commonErrorHandler }) => {
  document.body.addEventListener('click', async event => {
    const { eventListener } = event.target.dataset
    if (typeof listeners[eventListener] === 'function') {
      event.stopPropagation()
      await listeners[eventListener]()
    }
  })
  window.addEventListener('generationerror', errrorHandler)
}

export {
  initPage,
  requestByFileUpload
}

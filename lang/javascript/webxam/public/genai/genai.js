/**
 * @fileoverview 生成AIのAPIを利用する上で共通の処理をまとめたスクリプト
 */

class GenaiRequest {
  #api_url = ''

  constructor({ api_url }) {
    this.#api_url = api_url
  }

  async execute({ contents, contentType, responseType = 'text' }) {
    const info = {
      method: 'POST',
      body: contents
    }
    if (contentType) {
      info.headers = {
        'Content-Type': contentType
      }
    }
    const response = await fetch(this.#api_url, info)
    const text = await response[responseType.toLowerCase()]()
    if (!response.ok) {
      window.dispatchEvent(new CustomEvent('generationerror', {
        detail: text
      }))
    }
    return text
  }
}

class GenaiTextRequest extends GenaiRequest {
  constructor({ api_url }) {
    super({ api_url })
  }

  async execute({ contents }) {
    return await super.execute({
      contents: JSON.stringify({ contents }),
      contentType: 'application/json'
    })
  }
}

const getFileUploadContents = (selectedFile, params) => {
  const formData = new FormData()
  formData.append('file', selectedFile.files[0])

  const contents = params.reduce((acc, cur) => {
    acc.append(cur.name, cur.value)
    return acc
  }, formData)

  return contents
}

class GenaiFileUploadRequest extends GenaiRequest {
  constructor({ api_url }) {
    super({ api_url })
  }

  async execute({ selectedFile, params = [], responseType }) {
    const contents = getFileUploadContents(selectedFile, params)
    return await super.execute({ contents, responseType })
  }
}

const createGenaiRequest = ({ type, api_url }) => {
  const t = type ? type.toLowerCase() : 'text'
  if (t === 'fileupload') {
    return new GenaiFileUploadRequest({ api_url })
  } else if (t === 'text') {
    return new GenaiTextRequest({ api_url })
  } else {
    throw new Error(`Unsupported Type: ${type}`)
  }
}

/**
 * dispatchEventではなくdispatchErrorが欲しい。エラーに処理を委譲した瞬間、
 * 処理が中止されてほしいのである。
 */
const dispatchGenAIError = reason => {
  window.dispatchEvent(new CustomEvent('generationerror', {
    detail: reason
  }))
}

class GenAIError extends Error {
  constructor(reason) {
    super(reason)
  }
}

class GenAIHttpError extends GenAIError {
  constructor(reason, statusCode) {
    super(reason)
    this.statusCode = statusCode
  }
}

const requestByFileUpload = async ({ api_url, selectedFile, type = 'text' }) => {
  const contents = new FormData()
  contents.append('file', selectedFile.files[0])
  const response = await fetch(api_url, {
    method: 'POST',
    body: contents
  })
  const responseBody = await response[type]()
  if (response.ok) {
    return responseBody
  } else {
    window.dispatchEvent(new CustomEvent('generationerror', {
      detail: await response.text() // エラー時はtypeによらずエラーメッセージを取得する。
    }))
  }
}

const requestByText = async ({ api_url, contents }) => {
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
  createGenaiRequest,
  initPage,
  requestByText,
  requestByFileUpload,
  dispatchGenAIError,
  GenAIError,
  GenAIHttpError
}

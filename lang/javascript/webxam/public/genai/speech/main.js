/**
 * @fileoverview 音声生成APIを試すためのスクリプトです。
 * 
 */

import { initPage, GenAIHttpError, dispatchGenAIError } from "../genai.js"

class GeneratedSpeech {
  #speech
  #contentType
  #url

  constructor(speech, contentType) {
    this.#speech = speech
    this.#contentType = contentType
  }

  get url() {
    if (!this.#url) {
      this.#url = URL.createObjectURL(this.#speech)
    }
    return this.#url
  }

  // Explicit Resource Managementによりこのクラスのインスタンスが
  // スコープを抜けた時に自動的に以下のメソッドが呼び出されてリソースが解放される。
  // 参考:https://v8.dev/features/explicit-resource-management
  [Symbol.dispose]() {
    URL.revokeObjectURL(this.#url)
    console.log(`Revoked Audio URL:${this.#url}`)
    this.#url = null
  }
}

const createSpeechElement = generatedSpeech => {
  using genSpeech = generatedSpeech

  const audioElement = document.createElement('audio')
  audioElement.controls = true
  const sourceElement = document.createElement('source')
  sourceElement.src = genSpeech.url
  sourceElement.type = generatedSpeech.contentType
  audioElement.appendChild(sourceElement)

  return audioElement
}

const textfileToSpeech = async file => {
  const api_url = '/brest/genaiapi/generate/speech-generation/'
  const contents = new FormData()
  contents.append('file', file)
  const response = await fetch(api_url, {
    method: 'POST',
    body: contents
  })
  const contentType = response.headers.get('Content-Type')
  if (response.ok) {
    return new GeneratedSpeech(await response.blob(), contentType)
  } else {
    throw new GenAIHttpError(response.statusText, response.status)
  }
}

const listeners = {
  sendDocument: async () => {
    const output = document.querySelector(`.generation-speech-by-one-person .output`)
    output.textContent = ''
    const selectedFile = document.getElementById('selected-file')
    try {
      const genSpeech = await textfileToSpeech(selectedFile.files[0])
      // const audioElement = genSpeech.createSpeechElement()
      const audioElement = createSpeechElement(genSpeech)
      output.appendChild(audioElement)
    } catch (error) {
      dispatchGenAIError(error.message)
    }
  }
}

initPage({ listeners })

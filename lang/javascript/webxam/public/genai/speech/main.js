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

  get contentType() {
    return this.#contentType
  }

  // Explicit Resource Managementによりこのクラスのインスタンスが
  // スコープを抜けた時に自動的に以下のメソッドが呼び出されてリソースが解放される。
  // 音声の再生が実行されるより前に呼び出されてしまうと音声が正常に再生できない状態になる。
  // 一度音声を再生した後はBlobURLがrevokeされていても再度音声を再生できる。
  // 参考:https://v8.dev/features/explicit-resource-management
  [Symbol.dispose]() {
    console.log(`Dispose Audio Blob URL:${this.#url}`)
    URL.revokeObjectURL(this.#url) // nullを渡してもエラーにならない。
    this.#url = null
  }
}

/**
 * 引数のGeneratedSpeechが保持する音声データを再生できるaudio要素を生成して返します。
 * @param {GeneratedSpeech} generatedSpeech 
 * @returns AudioElement
 */
const createSpeechElement = generatedSpeech => {
  const audioElement = document.createElement('audio')

  // 一度再生が終わったところでリソース解放を試みる。
  // usingのスコープをonendedないに作成することで、onended終了時にリソース解放が行われるようにしている。
  audioElement.onended = () => {
    using _ = generatedSpeech
  }

  audioElement.controls = true
  const sourceElement = document.createElement('source')
  sourceElement.src = generatedSpeech.url
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
      const generatedSpeech = await textfileToSpeech(selectedFile.files[0])
      const audioElement = createSpeechElement(generatedSpeech)
      output.appendChild(audioElement)
    } catch (error) {
      dispatchGenAIError(error.message)
    }
  }
}

initPage({ listeners })

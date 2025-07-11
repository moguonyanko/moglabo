/**
 * @fileoverview 音声生成APIを試すためのスクリプトです。
 * 
 */

import { initPage, GenAIHttpError, dispatchGenAIError } from "../genai.js"

class GeneratedSpeech {
  #speech
  #contentType

  constructor(speech, contentType) {
    this.#speech = speech
    this.#contentType = contentType
  }

  /**
   * 生成されたスピーチを再生するためのaudio要素を返します。
   * このメソッドをGeneratedSpeechクラス内に実装することで、
   * #speechや#contentTypeに対するsetter、getterの作成を避けることができます。
   * ただしcreateSpeechElementをGeneratedSpeechクラス外に静的な関数として実装することで、
   * #speechや#contentTypeを参照し、変更しうる関数を減らすこともできます。
   */
  createSpeechElement() {
    const url = URL.createObjectURL(this.#speech)
    const audioElement = document.createElement('audio')
    audioElement.controls = true
    audioElement.onended = () => {
      URL.revokeObjectURL(url) // revokeObjectURLが実行されても音声を再度再生できる。
    }

    const sourceElement = document.createElement('source')
    sourceElement.src = url
    sourceElement.type = this.#contentType
    audioElement.appendChild(sourceElement)

    return audioElement
  }
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
      const audioElement = genSpeech.createSpeechElement()
      output.appendChild(audioElement)    
    } catch (error) {
      dispatchGenAIError(error.message)
    }
  }
}

initPage({ listeners })

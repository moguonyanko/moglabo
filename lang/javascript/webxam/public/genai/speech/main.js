/**
 * @fileoverview 音声生成APIを試すためのスクリプトです。
 * 
 */

import { initPage, requestByFileUpload } from "../genai.js"

const listeners = {
  sendDocument: async () => {
    const baseClass = '.generation-speech-by-one-person'
    const output = document.querySelector(`${baseClass} .output`)
    output.textContent = ''

    const selectedFile = document.getElementById('selected-file')
    const api_url = '/brest/genaiapi/generate/speech-generation/'

    const audio = await requestByFileUpload({
      api_url, selectedFile, type: 'blob'
    })
    const url = URL.createObjectURL(audio)

    const audioElement = document.createElement('audio')
    audioElement.onload = () => {
      URL.revokeObjectURL(url)
      output.appendChild(audioElement)
    }
    audioElement.src = url
  }
}

initPage({ listeners })

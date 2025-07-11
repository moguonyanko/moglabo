/**
 * @fileoverview Gemini APIのLive APIを試すためのスクリプトです。
 * 
 * Live API自体が正常に動作しないのでサンプルコード作成は停止中である。
 */

import { initPage, GenAIHttpError, dispatchGenAIError } from "../genai.js"

const getAudioElement = (audioBlob, contentType = 'audio/wav') => {
    const url = URL.createObjectURL(audioBlob)
    const audioElement = document.createElement('audio')
    audioElement.controls = true
    audioElement.onended = () => URL.revokeObjectURL(url)

    const sourceElement = document.createElement('source')
    sourceElement.src = url
    sourceElement.type = contentType
    audioElement.appendChild(sourceElement)

    return audioElement
}

const listeners = {
  onsendmessagebutton: async () => {
    const output = document.querySelector(`.generation-speech-by-text .output`)
    output.textContent = ''
    const userInput = document.getElementById('user-input').value
    try {
      const api_url = '/brest/genaiapi/generate/live-api/text-to-speech/'
      const response = await fetch(api_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: userInput
        })
      })
      const blob = await response.blob()
      const audioElement = getAudioElement(blob)
      output.appendChild(audioElement)
    } catch (error) {
      dispatchGenAIError(error.message)
    }
  }
}

initPage({ listeners })

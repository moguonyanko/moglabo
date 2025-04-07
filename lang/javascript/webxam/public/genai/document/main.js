/**
 * @fileoverview ドキュメントからテキストを生成するAPIを調べるためのスクリプト
 */

import { initPage, requestByFileUpload } from "../genai.js"

const listeners = {
  sendDocument: async () => {
    const baseClass = '.generation-summarization-from-document'
    const output = document.querySelector(`${baseClass} .output`)
    output.textContent = ''
    const selectedFile = 
      document.querySelector(`${baseClass} .selected-file`)
    const api_url = '/brest/genaiapi/generate/summarization-from-document/'

    const text = await requestByFileUpload({
      api_url, selectedFile
    })

    output.textContent = text
  }
}

initPage({ listeners })

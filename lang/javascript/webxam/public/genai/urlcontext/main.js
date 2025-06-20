/**
 * @fileoverview Gemini APIのURLコンテキスト機能を試すためのスクリプトです。
 * 
 */

import { initPage, createGenaiRequest } from "../genai.js"

const listeners = {
  sendUrl: async () => {
    const url = document.getElementById('target-url').value
    const operation = document.getElementById('operation').value
    if (!url || !operation) {
      return
    }
    // TODO: 複数の要素を扱えるようにしたいが、ひとまず一つだけ。
    const contents = [{
      url, 
      operation
    }]
    const api_url = '/brest/genaiapi/generate/inspect-url-context/'
    const request = createGenaiRequest({ api_url })
    const result = await request.execute({
      contents
    })

    const output = document.querySelector('.inspect-url-context-sample .output')
    output.textContent = JSON.stringify(result)
  }
}

initPage({ listeners })

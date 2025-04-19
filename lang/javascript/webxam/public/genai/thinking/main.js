/**
 * @fileoverview 生成AIの「考える」APIを利用するサンプルスクリプト
 */

import { initPage, createGenaiRequest } from "../genai.js"

// DOM

const getRequestItemJson = () => {
  const contents = {
    position: {
      start: document.getElementById('position-start').value,
      end: document.getElementById('position-end').value
    },
    period: {
      start: document.getElementById('period-start').value,
      end: document.getElementById('period-end').value
    },
    purpose: document.getElementById('purpose').textContent
  }

  return contents
}

const listeners = {
  generateText: async () => {
    const baseClass = '.generation-travel-project'
    const output = document.querySelector(`${baseClass} .output`)
    output.textContent = ''

    const api_url = '/brest/genaiapi/generate/travel-project/'

    const contents = getRequestItemJson()
    const req = createGenaiRequest({ api_url })
    const result = await req.execute({
      contents
    })

    output.textContent = JSON.stringify(result)
  }
}

initPage({ listeners })

/**
 * @fileoverview グラウンディングを利用した問い合わせを行うサンプルスクリプト
 */

import { initPage, createGenaiRequest } from "../genai.js"

// DOM

const getRequestItemJson = () => {
  const params = Array.from(document.querySelectorAll('.item-param'))
  if (params.some(el => !el.value)) {
    throw new Error('Invalid parameter')
  }

  const contents = params.map(el => {
    return {
      key: el.id.split('item-')[1],
      value: el.value
    }
  }).reduce((acc, current) => {
    acc[current.key] = current.value
    return acc 
  }, {})

  return contents
}

const listeners = {
  predictPrice: async () => {
    const baseClass = '.generation-text-with-grounding'
    const output = document.querySelector(`${baseClass} .output`)
    output.textContent = ''
    const api_url = '/brest/genaiapi/generate/price-prediction/'

    const contents = getRequestItemJson()
    const req = createGenaiRequest({ api_url })
    const result = await req.execute({
      contents
    })

    output.textContent = JSON.stringify(result)
  }
}

initPage({ listeners })

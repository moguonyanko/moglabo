/**
 * @fileoverview エンベディングのAPIを利用するサンプルスクリプト
 */

import { initPage, createGenaiRequest } from "../genai.js"

// DOM

class SampleTextElement extends HTMLElement {
  constructor() {
    super()

    const templateContent = document.getElementById('sample-text-template').content
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(templateContent.cloneNode(true));    
  }

  get value() {
    const root = this.shadowRoot
    return root.getElementById('sample-text').value
  }
  
  connectedCallback() {
    const initialText = this.getAttribute('value')
    if (initialText) {
      this.shadowRoot.getElementById('sample-text').value = initialText
    }
  }
}

const getSampleTextList = () => {
  const sampleTextEles = document.querySelectorAll('sample-text')
  const values = Array.from(sampleTextEles).map(ele => ele.value)
  return values
}

const listeners = {
  calculateSimilarity: async () => {
    const baseClass = '.generation-text-similarity'
    const output = document.querySelector(`${baseClass} .output`)
    output.textContent = ''
    const api_url = '/brest/genaiapi/generate/text-similarity/'

    const contents = getSampleTextList()
    const existsEmpty = contents.length === 0 || contents.some(text => text.length === 0)
    if (existsEmpty) {
      return
    }

    const req = createGenaiRequest({ api_url })
    const similarity = await req.execute({
      contents
    })

    output.textContent = similarity * 100
  }
}

initPage({ listeners })

customElements.define('sample-text', SampleTextElement)

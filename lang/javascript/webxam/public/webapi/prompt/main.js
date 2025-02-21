/**
 * @fileoverview Prompt APIを試すためのスクリプトです。
 * 参考:
 * https://web.dev/articles/ai-chatbot-promptapi?hl=ja
 * https://github.com/webmachinelearning/prompt-api
 */

const systemPrompt = 'You are an excellent assistant. I will answer questions about work and study.'

const funcs = {
  prompt: async ({ text }) => {
    const session = await self.ai.languageModel.create({
      systemPrompt
    })
    const result = await session.prompt(text)
    return result
  },
  promptStreaming: async ({ text }) => {
    const session = await self.ai.languageModel.create({
      systemPrompt
    })
    const stream = await session.promptStreaming(text)
    const results = [] // 本当はyieldなどを使いたい。
    for await (const chunk of stream) {
      results.push(chunk)
    }
    return results.join('')
  }
}

// DOM

class MyPrompt extends HTMLElement {
  constructor() {
    super()
    const template = document.getElementById('my-prompt').content
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(template.cloneNode(true))
  }

  connectedCallback() {
    const root = this.shadowRoot
    const type = this.getAttribute('type')
    root.addEventListener('click', async event => {
      if (event.target.id === 'doPrompt') {
        event.stopPropagation()
        const text = root.querySelector('.prompt').value
        const result = await funcs[type]?.({ text })
        const output = root.querySelector('.output')
        output.textContent = result
      }
    })
  }
}

const init = () => {
  const main = document.querySelector('main')
  main.addEventListener('click', async event => {
    const { eventListener } = event.target.dataset
    await funcs[eventListener]?.()
  })
  customElements.define('my-prompt', MyPrompt)
}

init()

/**
 * @fileoverview Prompt APIを試すためのスクリプトです。
 * 参考:
 * https://web.dev/articles/ai-chatbot-promptapi?hl=ja
 * https://github.com/webmachinelearning/prompt-api
 */

const systemPrompt = 'あなたは優秀な技術者です。仕事や勉強に関する質問に回答してください。'
const DEFAULT_LANG = 'ja'

const languageOptions = {
  expectedInputs: [
    {
      type: "text", languages: [
        DEFAULT_LANG /* system prompt */,
        DEFAULT_LANG /* user prompt */
      ]
    }
  ],
  expectedOutputs: [
    { type: "text", languages: [DEFAULT_LANG] }
  ]
}

const monitor = m => {
  m.addEventListener('downloadprogress', event => {
    console.log(`Downloaded ${event.loaded * 100}%`)
  })
}

const funcs = {
  prompt: async ({ text }) => {
    const session = await LanguageModel.create({
      systemPrompt,
      ...languageOptions,
      monitor
    })
    const result = await session.prompt(text)
    return result
  },
  promptStreaming: async ({ text }) => {
    const session = await LanguageModel.create({
      systemPrompt,
      ...languageOptions,
      monitor
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
        try {
          event.target.setAttribute('disabled', 'disabled')
          const result = await funcs[type]?.({ text })
          const output = root.querySelector('.output')
          output.textContent = result
        } finally {
          event.target.removeAttribute('disabled')
        }
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

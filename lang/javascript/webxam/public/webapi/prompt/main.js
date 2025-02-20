/**
 * @fileoverview Prompt APIを試すためのスクリプトです。
 * 参考:
 * https://web.dev/articles/ai-chatbot-promptapi?hl=ja
 * https://github.com/webmachinelearning/prompt-api
 */

// DOM

const systemPrompt = 'You are an excellent assistant. I will answer questions about work and study.'

const listeners = {
  doPrompt: async () => {
    const section = document.querySelector('.promptExample')
    const session = await self.ai.languageModel.create({
      systemPrompt
    })
    const prt = section.querySelector('.prompt').value
    const result = await session.prompt(prt)
    const output = section.querySelector('.output')
    output.textContent = result
  },
  doPromptStreaming: async () => {
    const section = document.querySelector('.promptStreamingExample')
    const output = section.querySelector('.output')
    output.textContent = ''
    const session = await self.ai.languageModel.create({
      systemPrompt
    })
    const prt = section.querySelector('.prompt').value
    const stream = await session.promptStreaming(prt)
    for await (const chunk of stream) {
      output.textContent += result
    }
  }
}

const init = () => {
  const main = document.querySelector('main')
  main.addEventListener('click', async event => {
    const { eventListener } = event.target.dataset
    await listeners[eventListener]?.()
  })
}

init()

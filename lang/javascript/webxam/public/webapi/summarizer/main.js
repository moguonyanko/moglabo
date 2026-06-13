/**
 * @fileoverview Summarizer APIを調べるためのスクリプトです。
 * 参考:
 * https://developer.chrome.com/docs/ai/summarizer-api?hl=ja
 */
/* eslint-disable no-undef */

const SUMMARIZER_LANG = 'ja-JP'

const summarizerOptions = {
  downloadprogress: e => {
    console.log(e)
    const { loaded, total } = e
    console.log(`ダウンロード:${loaded} of ${total} bytes.`)
  }
}

const createSummrizer = async ({ downloadprogress } = {}) => {
  // 不意にfalseになる。Summarizer APIの使用可否をチェックするには不適切である。
  // if (navigator.userActivation.isActive) {
  //   throw new Error(`The Summarizer API isn't usable.`)
  // }

  const summarizer = await Summarizer.create({
    // expectedInputLanguagesで指定した以外の言語を入力値に使用しても動作する。
    expectedInputLanguages: [SUMMARIZER_LANG],
    outputLanguage: SUMMARIZER_LANG,
    monitor: monitor => {
      if (typeof downloadprogress === 'function') {
        monitor.addEventListener('downloadprogress', downloadprogress)
      }
    }
  })
  return summarizer
}

class MySummarizer {
  constructor(name, summarizer) {
    this.name = name
    this.summarizer = summarizer
  }

  static async create(name) {
    const summarizer = await createSummrizer()
    return new MySummarizer(name, summarizer)    
  }

  async summarize(text) {
    return await this.summarizer.summarize(text)
  }

  async summarizeStreaming(text) {
    return await this.summarizer.summarizeStreaming(text)
  }

  [Symbol.dispose]() {
    this.summarizer?.destroy()
    console.log(`${this.name} is destroyed`)
  }
}

const enableApi = async () => {
  return typeof Summarizer === 'function' && await Summarizer.availability();
}

// DOM

const checkEnableApi = async () => {
  const enableApiEle = document.querySelector('.enable-api')
  const result = await enableApi()
  enableApiEle.textContent = result
  if (result) {
    enableApiEle.classList.add('enable')
  } else {
    enableApiEle.classList.remove('enable')
  }
}

const funcs = {
  summarize: async () => {
    const sampleText = document.querySelector('.summarize .sample-text').value
    using summarizer = await MySummarizer.create('サンプルサマライザー')

    const summary = await summarizer.summarize(sampleText)
    const output = document.querySelector('.summarize .output')
    output.textContent = summary
  },
  summarizeStreaming: async () => {
    const sampleText = document.querySelector('.summarizeStreaming .sample-text').value
    if (!sampleText) {
      return
    }
    const output = document.querySelector('.summarizeStreaming .output')
    output.textContent = ''
    try {
      using summarizer = await MySummarizer.create('ストリーミングサンプルサマライザー')
      const stream = await summarizer.summarizeStreaming(sampleText)
      let result = '';
      let previousLength = 0;
      for await (const segment of stream) {
        output.textContent += segment
      }
    } catch (err) {
      output.textContent = `<p>${err.message}</p>`
    }
  }
}

const initSummarizerTest = async () => {
  const output = document.querySelector('.summarizer-create .output')

  try {
    using summarizer = await MySummarizer.create('初期化テスト用サマライザー')
    output.textContent = 'Summarizerを初期化できるブラウザです。'
    // summarizerはスコープを抜けた後にdisposeされる。
  } catch (err) {
    output.textContent = err.message
  } 
}

const init = async () => {
  await checkEnableApi()
  await initSummarizerTest()
  const main = document.querySelector('main')
  main.addEventListener('click', async event => {
    const { eventFunction } = event.target.dataset
    if (typeof funcs[eventFunction] === 'function') {
      event.stopPropagation()
      try {
        event.target.setAttribute('disabled', 'disabled')
        await funcs[eventFunction]()
      } finally {
        event.target.removeAttribute('disabled')
      }
    }
  })
}

await init()

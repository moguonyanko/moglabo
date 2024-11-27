/**
 * @fileoverview Summarizer APIを調べるためのスクリプトです。
 * 参考:
 * https://developer.chrome.com/docs/ai/summarizer-api?hl=ja
 */
/* eslint-disable no-undef */

const createSummrizer = async ({ downloadprogress }) => {
  const available = (await self.ai.summarizer.capabilities()).available;

  if (available === 'no') {
    throw new Error(`The Summarizer API isn't usable.`)
  }

  const summarizer = await ai.summarizer.create({
    monitor: m => {
      m.addEventListener('downloadprogress', downloadprogress)
    }
  })
  return summarizer
}

const enableApi = () => {
  return 'ai' in self && 'summarizer' in self.ai
}

const checkEnableApi = () => {
  const enableApiEle = document.querySelector('.enable-api')
  const result = enableApi()
  enableApiEle.textContent = result
  if (result) {
    enableApiEle.classList.add('enable')
  } else {
    enableApiEle.classList.remove('enable')
  }
}

let summarizer

const funcs = {
  summarize: async () => {
    const sampleText = document.querySelector('.summarize .sample-text').value
    // TODO: 英語で要約されてしまう。英語しか対応されていない？
    const summary = await summarizer.summarize(sampleText)
    const output = document.querySelector('.summarize .output')
    output.innerHTML += `<p>${summary}</p>`
  },
  summarizeStreaming: async () => {
    const sampleText = document.querySelector('.summarizeStreaming .sample-text').value
    if (!sampleText) {
      return
    }
    const output = document.querySelector('.summarizeStreaming .output')
    output.innerHTML = ''
    try {
      const stream = await summarizer.summarizeStreaming(sampleText)
      let result = '';
      let previousLength = 0;
      for await (const segment of stream) {
        const newContent = segment.slice(previousLength)
        output.innerHTML += `${newContent}<br />`
        previousLength = segment.length
        result += newContent
      }   
      output.innerHTML = `<p>${result}</p>`  
    } catch (err) {
      output.innerHTML = `<p>${err.message}</p>`  
    }
  }
}

const initSampleSummrizer = async () => {
  const output = document.querySelector('.summarizer-create .output')

  try {
    summarizer = await createSummrizer({
      downloadprogress: e => {
        console.log(e)
        output.textContent = `ダウンロード:${e.loaded} of ${e.total} bytes.`
      }
    })
  } catch (err) {
    output.textContent = err.message
  }
}

const init = async () => {
  checkEnableApi()
  await initSampleSummrizer()
  const main = document.querySelector('main')
  main.addEventListener('click', async event => {
    const { eventFunction } = event.target.dataset
    if (typeof funcs[eventFunction] === 'function') {
      event.stopPropagation()
      await funcs[eventFunction]()
    }
  })
}

init().then()

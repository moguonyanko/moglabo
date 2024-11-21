/**
 * @fileoverview Translator APIを試すためのスクリプトです。
 * 参考:
 * https://developer.chrome.com/docs/ai/translator-api?hl=ja
 */
/* eslint-disable no-undef */

const funcs = {
  canTranslate: async () => {
    const sourceLanguage = document.querySelector('.canTranslate .sourceLanguage').value
    const targetLanguage = document.querySelector('.canTranslate .targetLanguage').value
    if (!sourceLanguage || !targetLanguage) {
      return
    }
    const result = await translation.canTranslate({
      sourceLanguage, targetLanguage
    })
    const output = document.querySelector('.canTranslate .output')
    output.textContent = result
  },
  translate: async () => {
    const sourceLanguage = document.querySelector('.translate .sourceLanguage').value
    const targetLanguage = document.querySelector('.translate .targetLanguage').value

    const translator = await translation.createTranslator({
      sourceLanguage,
      targetLanguage
    })
    translator.ondownloadprogress = progressEvent => {
      // TODO: ProgressEventが発生していない？
      console.log(progressEvent.loaded, progressEvent.total)
    }

    const sourceText = document.querySelector('.translate .sourceText').value
    const result = await translator.translate(sourceText)
    const output = document.querySelector('.translate .output')
    output.textContent = result
  }
}

const addListener = () => {
  const main = document.querySelector('main')
  main.addEventListener('click', async event => {
    const { id } = event.target
    if (typeof funcs[id] === 'function') {
      event.stopPropagation()
      await funcs[id]()
    }
  }) 
}

const enableTranslatorApi = () => {
  return 'translation' in self && 'createTranslator' in self.translation
}

const checkEnableApi = () => {
  const infoEle = document.getElementById('enableApi')
  const result = enableTranslatorApi()
  infoEle.textContent = result
  if (result) {
    infoEle.classList.add('enable')
  } else {
    infoEle.classList.remove('enable')
  }
}

const init = () => {
  checkEnableApi()
  addListener()
}

init()

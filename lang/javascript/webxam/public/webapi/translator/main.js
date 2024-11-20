/**
 * @fileoverview Translator APIを試すためのスクリプトです。
 * 参考:
 * https://developer.chrome.com/docs/ai/translator-api?hl=ja
 */

// DOM

const enableTranslatorApi = () => {
  return 'translation' in self && 'createTranslator' in self.translation
}

const init = () => {
  const infoEle = document.getElementById('enable-api')
  infoEle.textContent = enableTranslatorApi()
}

init()

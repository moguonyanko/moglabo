/**
 * @fileoverview Translator APIを試すためのスクリプトです。
 * 参考:
 * https://developer.chrome.com/docs/ai/translator-api?hl=ja
 */
/* eslint-disable no-undef */

const translate = async ({sourceText, sourceLanguage, targetLanguage}) => {
  try {
    const translator = await translation.createTranslator({
      sourceLanguage,
      targetLanguage
    })
    translator.ondownloadprogress = progressEvent => {
      // TODO: ProgressEventが発生していない？
      console.log(progressEvent.loaded, progressEvent.total)
    }
  
    const result = await translator.translate(sourceText)
    return result  
  } catch (err) {
    const msgs = [
      `sourceLanguage:${sourceLanguage}`, 
      `targetLanguage:${targetLanguage}`,
      err.message
    ]
    const evt = new CustomEvent('translationerror', {
      detail: msgs.join('\n')
    })
    self.dispatchEvent(evt)
  }
}

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
    const sourceText = document.querySelector('.translate .sourceText').value
    const result = await translate({sourceText, sourceLanguage, targetLanguage})
    const output = document.querySelector('.translate .output')
    output.textContent = result
  },
  translateWithDetection: async () => {
    const canDetectResult = await translation.canDetect()
    if (canDetectResult === 'no') {
      return
    }
    if (canDetectResult === 'readily') {
      const detector = await translation.createDetector()
      const sourceText = document.querySelector('.detector .sourceText').value
      const detectorResults = await detector.detect(sourceText) 
      let sourceLanguage
      let maxConficdence = 0
      for (let detectorResult of detectorResults) {
        console.log(detectorResult)
        if (maxConficdence < detectorResult.confidence) {
          sourceLanguage = detectorResult.detectedLanguage
          maxConficdence = detectorResult.confidence
        }
      }
      const result = await translate({sourceText, sourceLanguage, targetLanguage: 'ja'})
      const output = document.querySelector('.detector .output')
      output.textContent = result
    }
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

  self.addEventListener('translationerror', evt => {
    alert(evt.detail)
  })
}

const enableTranslatorApi = () => {
  return 'translation' in self && 'createTranslator' in self.translation
}

const enableDetectorApi = () => {
  return 'translation' in self && 'canDetect' in self.translation
}

const checkEnableApi = () => {
  const infoEle = document.getElementById('enableApi')
  const result = enableTranslatorApi() && enableDetectorApi()
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

/**
 * @fileoverview Webサイトからテキスト抽出するサンプルスクリプトです。
 * 
 */

import { executeGetAction, wsInit } from "../webscraping.js"

const onClick = {
  onGetTextFromImageUrl: async () => {
    await executeGetAction({
      outputSelector: '.extract-image-from-image-url-sample .output',
      urlSelector: '#extract-image-from-image-url',
      resourceName: 'imageurltext',
      propName: 'text'
    })
  }
}

const addEventListener = () => {
  document.body.addEventListener('click', async event => {
    const { eventListener } = event.target.dataset
    if (typeof onClick[eventListener] === 'function') {
      event.stopPropagation()
      try {
        await onClick[eventListener]()
      } catch (err) {
        alert(err.message)
      }
    }
  })
}

wsInit({ addEventListener })

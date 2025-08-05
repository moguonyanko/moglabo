/**
 * @fileoverview 指定したURLで参照されるページの内容を取得するサンプルスクリプトです。
 */

import { wsInit, wsGet } from "../webscraping.js"

const executeUrlAction = async ({ outputSelector, urlSelector,
  resourceName, propName }) => {
  const output = document.querySelector(outputSelector)
  output.textContent = ''

  const url = document.querySelector(urlSelector).value
  if (!url) {
    return
  }
  const contents = await wsGet({
    resourceName,
    params: {
      url
    },
    propName
  })
  output.textContent = contents
}

const onClick = {
  onGetPageContentsClick: async () => {
    await executeUrlAction({
      outputSelector: '.get-page-contents-sample .output',
      urlSelector: '#page-context-target-url',
      resourceName: 'pagecontents',
      propName: 'contents'
    })
  },
  onGetPageTitleClick: async () => {
    await executeUrlAction({
      outputSelector: '.get-page-title-sample .output',
      urlSelector: '#page-title-target-url',
      resourceName: 'pagetitle',
      propName: 'title'
    })
  },
  onGetImgSrcListClick: async () => {
    const baseClass = '.get-page-image-src-list '
    const output = document.querySelector(`${baseClass}.output`)
    output.textContent = ''

    const url = document.querySelector(`${baseClass}.target-url`).value
    const format =
      document.querySelector(`${baseClass}.target-image-format`).value

    const srclist = await wsGet({
      resourceName: 'pageimgsrclist',
      params: {
        url,
        format
      },
      propName: 'imgsrclist'
    })
    const fragment = srclist.map(src => {
      const img = new Image()
      img.src = src
      return img
    }).reduce((acc, current) => {
      acc.appendChild(current)
      return acc
    }, document.createDocumentFragment())
    output.appendChild(fragment)
  }
}

const getHello = async () => {
  const api_url = '/brest/webscraping/hellowebscraping/'
  const response = await fetch(api_url, {
    method: 'GET'
  })
  if (!response.ok) {
    throw new Error(`HTTP REQUEST ERROR:${response.statusText}`)
  }
  const { message } = await response.json()
  return message
}

const addEventListener = () => {
  document.body.addEventListener('click', async event => {
    const { eventListener } = event.target.dataset
    if (typeof onClick[eventListener] === 'function') {
      event.stopPropagation()
      try {
        await onClick[eventListener]()
      } catch (err) {
        window.dispatchEvent(new CustomEvent('wserror', {
          detail: err.message
        }))
      }
    }
  })

  window.addEventListener('wserror', err => {
    alert(err.detail)
  })
}

const initFuncs = {
  hello: async () => {
    const message = await getHello()
    const date = new Date().toString()
    const output = document.querySelector('.hello-webscraping .output')
    output.textContent = `${date}:${message}`
  }
}

const init = () => {
  wsInit(initFuncs)
  addEventListener()
}

init()

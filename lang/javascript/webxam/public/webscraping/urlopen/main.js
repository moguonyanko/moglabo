/**
 * @fileoverview WebスクレイピングのAPIを提供するWebサービスが
 * 正常に動作しているかどうかを確認するためのスクリプト
 */

import { wsInit, wsGet } from "../webscraping.js"

const onClick = {
  onGetPageContentsClick: async () => {
    const output = document.querySelector('.get-page-contents-sample .output')
    output.textContent = ''

    const url = document.getElementById('page-context-target-url').value
    if (!url) {
      return
    }
    const contents = await wsGet({
      resourceName: 'pagecontents',
      params: {
        url
      },
      propName: 'contents'
    })
    output.textContent = contents
  },
  onGetPageTitleClick: async () => {
    const output = document.querySelector('.get-page-title-sample .output')
    output.textContent = ''

    const url = document.getElementById('page-title-target-url').value
    if (!url) {
      return
    }
    const title = await wsGet({
      resourceName: 'pagetitle',
      params: {
        url
      },
      propName: 'title'
    })
    output.textContent = title
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

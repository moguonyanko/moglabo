/**
 * @fileoverview 静的ファイルの利用方法を調べるためのスクリプト
 */

const getHello = async () => {
  const url = '/webxam/apps/practicenode/hello'
  const response = await fetch(url)
  if (!response.ok) {
    const err = new CustomEvent('nodeerror', {
      detail: {
        message: `Request error: ${url}`,
        status: response.status
      }
    })
    window.dispatchEvent(err)
  }
  return await response.text()
}

const funcs = {
  errorTest: async () => {
    const response = await fetch('/webxam/apps/practicenode/errortest/')
    const err = new CustomEvent('nodeerror', {
      detail: {
        message: (await response.json()).message,
        status: response.status
      }
    })
    window.dispatchEvent(err)
  }
}

const addListener = () => {
  window.addEventListener('nodeerror', err => {
    console.log(err.detail)
    alert(err.detail.message)
  })

  const main = document.querySelector('main')
  main.addEventListener('click', event => {
    const {eventTarget} = event.target.dataset
    if (typeof funcs[eventTarget] === 'function') {
      event.stopPropagation()
      funcs[eventTarget]()
    }
  })
}

const checkStarting = async () => {
  const result = await getHello()
  const startChecker = document.querySelector(`*[data-start-checker]`)
  startChecker.textContent = result
}

const init = async () => {
  addListener()
  await checkStarting()
}

init().then()

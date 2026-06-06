/**
 * @fileoverview Web Locks APIを調査するためのスクリプトです。
 */

// DOM

const listeners = {
  "get-sample-lock": async () => {
    const output = document.querySelector('.example.get-sample-lock .output')
    await navigator.locks.request('myResource',
      { 'mode': 'shared' },
      async lock => {
        output.elements['result'].value = 'Get Lock'
      })
  }
}

const init = () => {
  const main = document.querySelector('main')
  main.addEventListener('click', async event => {
    const { eventListener } = event.target.dataset
    if (typeof listeners[eventListener] === 'function') {
      try {
        event.target.setAttribute('disabled', 'disabled')
        await listeners[eventListener]()
      } finally {
        event.target.removeAttribute('disabled')
      }
    }
  })
}

init()

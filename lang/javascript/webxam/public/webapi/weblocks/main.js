/**
 * @fileoverview Web Locks APIを調査するためのスクリプトです。
 */

// DOM

const display = (baseClass, message) => {
  const output = document.querySelector(`.${baseClass} .output`)
  output.elements['result'].value += message + ' '
}

const listeners = {
  onGetSampleLock: async () => {
    await navigator.locks.request('myResource',
      { mode: 'shared' },
      async lock => display('get-sample-lock', 'Get Lock'))
  },
  onGetSampleLockWithCancel: async () => {
    const controller = new AbortController()
    // ロックが取得されるとabortできないので相当短い時間を指定しないとabortを試せない。
    const msForCancel = 1
    setTimeout(() => controller.abort(), msForCancel)

    try {
      const callback = async lock =>
        display('get-sample-lock-with-cancel', 'Get Lock With Cancel')
      const options = {
        // 未指定なのでmodeはデフォルト値のexclusiveになる。
        signal: controller.signal
      }
      await navigator.locks.request('myResource', options, callback)
    } catch (err) {
      display('get-sample-lock-with-cancel', err.message)
    }
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

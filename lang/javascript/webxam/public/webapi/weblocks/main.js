/**
 * @fileoverview Web Locks APIを調査するためのスクリプトです。
 */

const display = (baseClass, message) => {
  const output = document.querySelector(`.${baseClass} .output`)
  output.elements['result'].value += message + ' '
}

const dummyLongTimeFunc = ({ baseClass, waitMs = 1000, message }) => {
  return new Promise(resolve => {
    setTimeout(() => {
      display(baseClass, message)
      resolve() // ここでロック解放
    }, waitMs)
  })
}

const getSelectedLockMode = () => {
  const eles = document.querySelectorAll('.lock-mode-container input[name="lockMode"]')
  const selectedEle = Array.from(eles).filter(ele => ele.checked)[0]
  return selectedEle.value
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
  },
  onCheckLockType: async () => {
    const lockName = 'race-condition-1'
    const baseClass = 'race-condition-example'
    const mode = getSelectedLockMode()

    const lockPromise1 = navigator.locks.request(lockName,
      { mode },
      async lock => {
        display(baseClass, `LOCK1: ${lock.name}`)
        const waitMs = 1000
        const message = 'DONE SOMETHING 1'
        await dummyLongTimeFunc({ baseClass, waitMs, message })
      })

    const lockPromise2 = navigator.locks.request(lockName,
      { mode },
      async lock => {
        display(baseClass, `LOCK2: ${lock.name}`)
        display(baseClass, 'DONE SOMETHING 2')
      })

    // ロック取得処理を順番に行う（逐次処理）と、常に同じ結果になってしまう。
    // 複数のロック取得を並行処理で行って、排他ロックと共有ロックの振る舞いの違いを確認しやすくする。
    await Promise.all([lockPromise1, lockPromise2])
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

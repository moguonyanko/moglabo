/**
 * @fileoverview ::backdrop疑似要素の使い方を調べるためのスクリプト
 */

const listeners = {
  showDialog: () => {
    const dialog = document.getElementById('simple-dialog')
    // show()では::backdoropで指定したスタイルが適用されない。
    dialog.showModal()
  }
}

const init = () => {
  const main = document.querySelector('main')
  main.addEventListener('click', event => {
    const { eventName } = event.target.dataset
    listeners[eventName]?.()
  })
}

init()

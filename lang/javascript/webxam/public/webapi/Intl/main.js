/**
 * @fileoverview 国際化APIを検証するためのスクリプトです。
 */

// DOM

const listeners = {
  formatValues: () => {
    const srcDateTime = new Date(document.getElementById('src-datetime').value)
    const srcCount = document.getElementById('src-count').value
    const targetLocale = document.getElementById('dist-locale').value

    const distDateTime = new Intl.DateTimeFormat(targetLocale).format(srcDateTime)
    const distCount = new Intl.NumberFormat(targetLocale).format(srcCount)

    const output = document.querySelector('.intl-datetime-numbe-format-example .output')
    output.innerHTML = `日時:${distDateTime}<br />数値表現:${distCount}`
  }
}

const init = () => {
  const main = document.querySelector('main')
  main.addEventListener('click', event => {
    const { eventListener } = event.target.dataset
    const listener = listeners[eventListener]
    if (typeof listener === 'function') {
      event.stopPropagation()
      listener()
    }
  })
}

init()

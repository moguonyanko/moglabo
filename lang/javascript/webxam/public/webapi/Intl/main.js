/**
 * @fileoverview 国際化APIを検証するためのスクリプトです。
 */

// DOM

const listeners = {
  formatValues: () => {
    const srcDateTime = new Date(document.getElementById('src-datetime').value)
    const srcCount = document.getElementById('src-count').value
    const targetLocale = document.getElementById('date-number-format-locale').value

    const distDateTime = new Intl.DateTimeFormat(targetLocale).format(srcDateTime)
    const distCount = new Intl.NumberFormat(targetLocale).format(srcCount)

    const output = document.querySelector('.intl-datetime-numbe-format-example .output')
    output.innerHTML = `日時:${distDateTime}<br />数値表現:${distCount}`
  },
  formatDuration: () => {
    const years = document.getElementById('duration-years').value
    const hours = document.getElementById('duration-hours').value
    const minutes = document.getElementById('duration-minutes').value
    const seconds = document.getElementById('duration-seconds').value

    const duration = {
      years, hours, minutes, seconds
    }

    const targetLocale = document.getElementById('duration-format-locale').value
    const result = new Intl.DurationFormat(targetLocale, { style: 'long' }).format(duration)

    const output = document.querySelector('.intl-duration-format-example .output')
    output.textContent = result
  }
}

class MyLocale extends HTMLElement {
  constructor() {
    super()

    const templateContent = document.getElementById('locale-template').content
    const shadow = this.attachShadow({'mode': 'open'})
    shadow.appendChild(templateContent.cloneNode(true))
  }

  get value() {
    return this.shadowRoot.getElementById('dist-locale').value
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

  customElements.define('my-locale', MyLocale)
}

init()

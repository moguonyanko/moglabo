/**
 * @fileoverview Web Bluetooth APIを試すためのスクリプト
 * 参考:
 * https://developer.chrome.com/docs/capabilities/bluetooth?hl=ja
 */

// DOM

const eventFunctions = {
  requestDevice: () => {
    const output = document.querySelector('.service-filter .output')
    navigator.bluetooth.requestDevice({
      filters: [{ services: ['battery_service'] }]
    })
    .then(device => {
        output.textContent = JSON.stringify(device)
    })
    .catch(error => {
      output.textContent = error.message
    })
  }
}

const init = () => {
  const main = document.querySelector('main')
  main.addEventListener('click', event => {
    const { eventFunction } = event.target.dataset
    eventFunctions[eventFunction]?.()
  })
}

init()

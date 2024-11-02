/**
 * @fileoverview Web Serial APIを調査するためのスクリプトです。
 * 参考:
 * https://developer.chrome.com/docs/capabilities/serial?hl=ja
 */

// DOM

const funcs = {
  getPorts: async () => {
    const ports = await navigator.serial.getPorts()
    const output = document.querySelector('.output.portInfo')
    const infoContent = []
    ports.forEach(port => {
      const info = port.getInfo()
      console.log(info)
      infoContent.push(JSON.stringify(info))
    })
    output.textContent = infoContent
  }
}

const enableSerialApi = () => Boolean(navigator.serial)

const init = () => {
  if (!enableSerialApi()) {
    alert('Web Serial API利用不可')
    return
  }

  const main = document.querySelector('main')
  main.addEventListener('click', event => {
    const { value } = event.target
    if (typeof funcs[value] === 'function') {
      event.stopPropagation()
      funcs[value]()
    }
  })
}

init()

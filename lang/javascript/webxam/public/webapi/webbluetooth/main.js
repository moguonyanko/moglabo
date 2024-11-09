/**
 * @fileoverview Web Bluetooth APIを試すためのスクリプト
 * 参考:
 * https://developer.chrome.com/docs/capabilities/bluetooth?hl=ja
 */

// DOM

const loadDeviceInfo = services => {
  if (!Array.isArray(services) || services.length === 0) {
    throw new Error(`Service names is not found`)
  }
  return new Promise((resolve, reject) => {
    navigator.bluetooth.requestDevice({
      filters: [{ services }]
    })
    .then(device => {
      resolve(JSON.stringify(device))
    })
    .catch(reject)
  })
}

const eventFunctions = {
  requestDevice: async () => {
    const serviceName = document.getElementById('service-name').value
    const output = document.querySelector('.service-filter .output')
    try {
      const info = await loadDeviceInfo([serviceName])
      output.textContent = JSON.stringify(device)
    } catch (error) {
      output.textContent = error.message
    }
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

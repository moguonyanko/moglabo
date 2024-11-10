/**
 * @fileoverview Web Bluetooth APIを試すためのスクリプト
 * 参考:
 * https://developer.chrome.com/docs/capabilities/bluetooth?hl=ja
 */

// DOM

const loadDeviceInfo = services => {
  let acceptAllDevices = false
  if (!Array.isArray(services) || services.length === 0) {
    acceptAllDevices = true
  }
  return new Promise((resolve, reject) => {
    const args = {}
    if (acceptAllDevices) { 
      args.acceptAllDevices = acceptAllDevices
    } else {
      args.filters = [{ services }]
    }
    navigator.bluetooth.requestDevice(args)
    .then(device => {
      resolve(JSON.stringify(device))
    })
    .catch(reject)
  })
}

const eventFunctions = {
  requestDevice: async () => {
    const serviceName = document.getElementById('service-name').value
    const services = serviceName ? [serviceName] : []
    const output = document.querySelector('.service-filter .output')
    try {
      const device = await loadDeviceInfo(services)
      // TODO: 取得結果が空のオブジェクトになってしまう。
      console.log(device)
      output.textContent = device.name
    } catch (error) {
      output.textContent = error.message
    }
  },
  clearDevices: () => {
    document.getElementById('service-name').value = ''
    const output = document.querySelector('.service-filter .output')
    output.textContent = ''
  }
}

const init = () => {
  document.querySelector('main').addEventListener('click', event => {
    const { eventFunction } = event.target.dataset
    if (typeof eventFunctions[eventFunction] === 'function') {
      event.stopPropagation()
      eventFunctions[eventFunction]()
    }
  })
}

init()

/**
 * @fileoverview FileSystemObserverを試すためのスクリプト
 */
/* eslint-disable no-undef */

// DOM

const enableFileSystemObserver = () => {
  return typeof new FileSystemObserver(() => {}).observe === 'function'
}

const getDisplayFileRecordFunc = output => {
  return (records, observer) => { 
    for (const record of records) {
      output.innerHTML += `${JSON.stringify(record)}<br />`
    }
  }
}

let observer;

const listenres = {
  connect: async () => {
    const output = document.querySelector('.callbackFunction .output')
    observer = new FileSystemObserver(getDisplayFileRecordFunc(output))
    const fileHandle = await showSaveFilePicker()
    await observer.observe(fileHandle)
  },
  disconnect: () => {
    observer.disconnect()
    const output = document.querySelector('.callbackFunction .output')
    output.textContent = ''
  }
}

const init = () => {
  document.getElementById('enableFileSystemObserver').textContent = 
  enableFileSystemObserver()

  const main = document.querySelector('main')
  main.addEventListener('click', async event => {
    const { eventListener } = event.target.dataset
    await listenres[eventListener]?.()
  })
}

init()

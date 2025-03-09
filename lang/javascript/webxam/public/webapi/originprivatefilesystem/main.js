/**
 * @fileoverview Origin Private File SystemのAPIを試すためのスクリプト
 */
/* eslint-disable no-undef */

// DOM

const enableFileSystemObserver = () => {
  return typeof new FileSystemObserver(() => {}).observe === 'function'
}

const getObserveDumpFunc = output => {
  return (records, observer) => { 
    for (const record of records) {
      output.innerHTML += `${JSON.stringify(record)}<br />`
    }
  }
}

let fileObserver, directoryObserver;

const listenres = {
  connectFile: async () => {
    const output = document.querySelector('.observeFile .output')
    fileObserver = new FileSystemObserver(getObserveDumpFunc(output))
    const handle = await showSaveFilePicker()
    await fileObserver.observe(handle)
  },
  disconnectFile: () => {
    fileObserver.disconnect()
    const output = document.querySelector('.observeFile .output')
    output.textContent = ''
  },
  connectDirectory: async () => {
    const output = document.querySelector('.observeDirectory .output')
    directoryObserver = new FileSystemObserver(getObserveDumpFunc(output))
    const handle = await showDirectoryPicker()
    await directoryObserver.observe(handle)
  },
  disconnectDirectory: async () => {
    directoryObserver.disconnect()
    const output = document.querySelector('.observeDirectory .output')
    output.textContent = ''
  },
  writeFile: async () => {
    const sampleText = 
      document.querySelector('.fileSystemWritableFileStream .sampleTextArea').value
    const textBlob = new Blob([sampleText], { type: 'text/plain' })
    const handle = await showSaveFilePicker()
    const writableStream = await handle.createWritable()
    await writableStream.write(textBlob)
    await writableStream.close()
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

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
const sampleFileName = 'samplememo'

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
  },
  resolvePath: async () => {
    const directoryHandle = await showDirectoryPicker()
    const fileHandle = await self.showOpenFilePicker()
    // TODO: NotAllowedErrorになる。
    const relativePaths = await directoryHandle.resolve(fileHandle)
    const output = document.querySelector('.resolveRelativePaths .output')
    output.textContent = ''
    relativePaths.forEach(path => {
      output.innerHTML += `${path}<br />`
    })    
  },
  writeFile: async () => {
    const message = document.querySelector('.readAndWriteFileSample .sampleTextArea').value
    const output = document.querySelector('.readAndWriteFileSample .output')
    const worker = new Worker('./writeFileWorker.js')
    worker.onmessage = event => {
      output.textContent = JSON.stringify(event.data)
    }
    worker.postMessage({
      message, fileName: sampleFileName
    })
  },
  readFile: async () => {
    const root = await navigator.storage.getDirectory() 
    const output = document.querySelector('.readAndWriteFileSample .output')
    try {
      const existingFileHandle = await root.getFileHandle(sampleFileName)
      const file = await existingFileHandle.getFile()   
      output.textContent = await file.text()  
    } catch (err) {
      output.textContent = err.message 
    }
  },
  removeFile: async () => {
    const root = await navigator.storage.getDirectory() 
    const existingFileHandle = await root.getFileHandle(sampleFileName)
    await existingFileHandle.remove()
    const output = document.querySelector('.readAndWriteFileSample .output')
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

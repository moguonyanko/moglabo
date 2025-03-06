/**
 * @fileoverview FileSystemObserverを試すためのスクリプト
 */
/* eslint-disable no-undef */

// DOM

const enableFileSystemObserver = () => {
  return typeof new FileSystemObserver(() => {}).observe === 'function'
}

const listenres = {
}

const init = () => {
  document.getElementById('enableFileSystemObserver').textContent = 
  enableFileSystemObserver()
}

init()

/**
 * @fileoverview Compression Streams API調査用スクリプト
 */

const COMPRESSED = true

const funcs = {
  deflateGZip: async () => {
    const path = COMPRESSED ? './sample.json.gz' : './sample.json'
    let readableStream = await fetch(path).then(response => response.body)
    if (COMPRESSED) {
      readableStream = readableStream.pipeThrough(new DecompressionStream('gzip'))
    }
    const reader = readableStream.getReader()
    const uintArrays = []
    const output = document.querySelector(`*[data-event-output='deflateGZip']`)
    const readerFunc = ({ done, value }) => {
      if (done) {
        console.log(`圧縮ファイルの展開：${COMPRESSED}`)
        console.log(uintArrays)
        const decoder = new TextDecoder('UTF-8')
        const result = decoder.decode(...uintArrays)
        output.textContent = result
        return
      }
      uintArrays.push(value)
      return reader.read().then(readerFunc)
    }
    reader.read().then(readerFunc)
  }
}

const addListener = () => {
  document.querySelector('main').addEventListener('click', event => {
    const { eventTarget } = event.target.dataset
    if (typeof funcs[eventTarget] === 'function') {
      event.stopPropagation()
      funcs[eventTarget]()
    }
  })
}

addListener()
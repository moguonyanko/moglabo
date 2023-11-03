/**
 * @fileoverview Compression Streams API調査用スクリプト
 */

const funcs = {
  deflateGZip: async () => {
    const readableStream = await fetch('./sample.json.gz').then(response => response.body)
    const ds = new DecompressionStream('gzip')
    const decompressedStream = readableStream.pipeThrough(ds)
    const reader = decompressedStream.getReader()
    const values = []
    const output = document.querySelector(`*[data-event-output='deflateGZip']`)
    const readerFunc = ({ done, value }) => {
      if (done) {
        console.log('Finish')
        const array = new Uint8Array(values)
        const decoder = new TextDecoder('UTF-8')
        // TODO: 期待した形のJSONが得られない。
        const result = decoder.decode(array)
        output.textContent = result
        return
      }
      values.push(value)
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
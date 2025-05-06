/**
 * @fileoverview Iterator関連のAPIを試すサンプルコード
 */

async function* streamToImageChunks(stream, chunkSize = 1024 * 5) {
  const reader = stream.getReader()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }
      // サイズを指定せずにチャンクを返す。全てのチャンクが一度に返されるわけではない。
      yield value // Uint8Array のチャンクを yield

      // chunkSizeごとに分割して yield
      // 大きな画像の場合ブラウザが固まってしまう。
      // if (value) {
      //   for (let i = 0; i < value.byteLength; i += chunkSize) {
      //     const chunk = value.slice(i, i + chunkSize)
      //     yield chunk
      //   }
      // }      
    }
  } finally {
    reader.releaseLock()
  }
}

/**
 * @deprecated チャンクを分けて読み込む。しかしこちらもブラウザが固まってエラーになってしまう。
 */
async function* streamToImageChunksBySizeBYOB(stream, chunkSize = 1024 * 5) {
  const reader = stream.getReader({ mode: 'byob' })
  let buffer = new ArrayBuffer(chunkSize)
  let view = new Uint8Array(buffer)

  try {
    while (true) {
      const { done, value } = await reader.read(view)
      if (done) {
        break;
      }

      if (value) {
        yield value.slice(0, value.byteLength) // 実際に読み込まれた部分だけ yield
      }

      // 次の読み込みのために同じバッファを再利用 (必要に応じて新しいバッファを作成)
      if (view.byteLength !== chunkSize) {
        buffer = new ArrayBuffer(chunkSize)
        view = new Uint8Array(buffer)
      }
    }
  } finally {
    reader.releaseLock()
  }
}

// DOM

async function iterateWithGenerator(file, callback) {
  try {
    const stream = file.stream()
    const generator = await streamToImageChunks(stream)
    // const generator = await streamToImageChunksBySizeBYOB(stream)

    // TODO: イテレータヘルパーメソッドを使うサンプルコード追加

    // ジェネレータからデータを順次取得して処理
    for await (const chunk of generator) {
      callback(chunk)
    }
  } catch (err) {
    const evt = new CustomEvent('iteratorerror', {
      detail: `ストリームの取得に失敗しました: ${err.message}`
    })
    window.dispatchEvent(evt)
  }
}

const funcs = {
  filter: () => {
    const output = document.querySelector('.filter-sample .output')
    output.innerHTML = ''

    const sampleFilterList = document.querySelectorAll('.sample-filter-list li')
    // Array.fromを要素群を適用しなくてもfilterなどのメソッドで処理できる。
    const results = sampleFilterList.values().filter(item => {
      return item.textContent.startsWith('Java')
    })
      // mapで返される結果はイテレーターヘルパーオブジェクトであり配列ではないためjoinはできない。
      .map(item => item.textContent)
      .reduce((acc, current) => {
        const p = document.createElement('p')
        p.textContent = current
        acc.appendChild(p)
        return acc
      }, document.createDocumentFragment())

    output.appendChild(results)
  },
  generateIterator: async () => {
    const file = document.getElementById('target-image').files[0]
    const output = document.querySelector('.generator-sample .output')

    /**
     * 結局チャンクを全てメモリ上（receivedChunks）に抱えているのであまり旨味がない。
     * ただしストリームを使うことでファイルの読み込みが完了するまで待たずに
     * 画像を描画し始めることはできる。
     * 返されるチャンクごとに画像を追加していくように描画するには描画位置を正しく算出してやる必要がある。
     */
    const receivedChunks = []
    await iterateWithGenerator(file, chunk => {
      console.log(chunk) // チャンクの数だけログ出力される。

      receivedChunks.push(chunk)
      const currentBlob = new Blob(receivedChunks, { type: file.type })
      const imageUrl = URL.createObjectURL(currentBlob)
      const img = new Image()
      img.onload = () => {
        img.width = img.naturalWidth
        img.height = img.naturalHeight
        URL.revokeObjectURL(imageUrl)
      }
      img.src = imageUrl
      output.innerHTML = ''
      output.appendChild(img)
    })
  }
}

const addListener = () => {
  const main = document.querySelector('main')
  main.addEventListener('click', event => {
    const { eventTarget } = event.target.dataset
    const func = funcs[eventTarget]
    if (typeof func === 'function') {
      event.stopPropagation()
      func()
    }
  })
  window.addEventListener('iteratorerror', err => {
    alert(err.detail)
  })
}

const main = () => {
  addListener()
}

main()

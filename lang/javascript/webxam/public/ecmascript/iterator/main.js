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
      // 全てのチャンクを返す場合
      // yield value // Uint8Array のチャンクを yield

      // 5KBごとに分割して yield
      if (value) {
        for (let i = 0; i < value.byteLength; i += chunkSize) {
          const chunk = value.slice(i, i + chunkSize)
          yield chunk
        }
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
    console.log(file)
    const output = document.querySelector('.generator-sample .output')

    /**
     * 結局チャンクを全てメモリ上に抱えているのであまり旨味がない。
     * ただしストリームを使うことでファイルの読み込みが完了するまで待たずに
     * 画像を表示することができる。
     * 返されるチャンクごとに画像を描画するには描画位置を正しく算出してやり必要がある。
     */
    const receivedChunks = []
    await iterateWithGenerator(file, chunk => {
      receivedChunks.push(chunk)
      const currentBlob = new Blob(receivedChunks, { type: file.type })
      const imageUrl = URL.createObjectURL(currentBlob)
      const img = new Image()
      img.onload = () => {
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

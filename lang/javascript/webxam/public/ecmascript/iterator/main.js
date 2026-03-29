/**
 * @fileoverview Iterator関連のAPIを試すサンプルコード
 */

/**
 * ジェネレータを用いたイテレーションが終了した時の情報をユーザーに提供するための例外クラス
 * 例外を使わずに表現できるのが理想だが、ここではPythonなどを真似て例外で表現している。
 */
class StopItration extends Error {
  constructor(message, { count, allSize }) {
    super(message)
    this.name = 'StopIteration'
    this.count = count
    this.allSize = allSize
  }
}

async function* streamToImageChunks(stream, chunkSize = 1024 * 5) {
  const reader = stream.getReader()

  try {
    let count = 0
    let allSize = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }
      count += 1
      allSize += value.byteLength
      // サイズを指定せずにチャンクを返す。全てのチャンクが一度に返されるわけではない。
      // いくつのチャンクに分割されるかはその時によって変わる。
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
    throw new StopItration('ストリームの読み込みが完了しました。', {
      count,
      allSize
    })
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
        break
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

const throwError = detail => {
  const evt = new CustomEvent('iteratorerror', {
    detail
  })
  window.dispatchEvent(evt)
}

const logChunk = chunk => {
  console.log(`'chunk':${new Date().toString()}`, chunk)
}

async function iterateWithGenerator(file, callback) {
  try {
    const stream = file.stream()
    const asyncGenerator = await streamToImageChunks(stream)
    // const generator = await streamToImageChunksBySizeBYOB(stream)

    // イテレータヘルパーメソッドを使ってみるテストためのコード
    try {
      asyncGenerator.forEach(logChunk)
    } catch (err) {
      console.error('AsyncGeneratorにはイテレータヘルパーメソッドが実装されていない。', err)
    }

    // ジェネレータからデータを順次取得して処理
    for await (const chunk of asyncGenerator) {
      callback(chunk)
    }
  } catch (err) {
    if (err instanceof StopItration) {
      callback(err)
    } else {
      throwError(`ストリームの取得に失敗しました: ${err.message}`)
    }
  }
}

const concatMaps = (...maps) => {
  console.log(maps)
  console.log(...maps)
  // Iterator.concatはObjectつまり{}は受け取れない。
  // Iteratableなオブジェクトを渡さなければならない。
  // キーが衝突する要素は上書きされる。
  return new Map(Iterator.concat(...maps))
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
    if (!file) {
      throwError('ファイルが選択されていません。')
      return
    }
    const divisor = Math.sqrt(parseInt(document.getElementById('divisor').value))
    if (isNaN(divisor) || divisor < 1) {
      throwError('最小値は1以上の整数でなければなりません。')
      return
    }
    const output = document.querySelector('.generator-sample .output')
    output.innerHTML = ''
    const info = document.querySelector('.generator-sample .info')
    info.textContent = ''

    /**
     * 結局チャンクを全てメモリ上（receivedChunks）に抱えているのでメモリ効率の点では利点がない。
     * ただしストリームを使うことでファイルの読み込みが完了するまで待たずに
     * 画像を描画し始めることはできる。つまりプログレッシブな処理とネットワーク負荷軽減の点では効果がある。
     * 返されるチャンクごとに画像を追加していくように描画するには描画位置を正しく算出してやる必要がある。
     */
    const receivedChunks = []
    await iterateWithGenerator(file, chunk => {
      if (chunk instanceof StopItration) {
        const { count, allSize } = chunk
        info.textContent = `ストリームの読み込みが完了しました。チャンク数: ${count}, サイズ: ${allSize}`
        return
      }

      receivedChunks.push(chunk)
      const currentBlob = new Blob(receivedChunks, { type: file.type })
      const imageUrl = URL.createObjectURL(currentBlob)
      const img = new Image()
      img.onload = () => {
        img.width = img.naturalWidth / divisor
        img.height = img.naturalHeight / divisor
        URL.revokeObjectURL(imageUrl)
      }
      img.src = imageUrl
      output.innerHTML = ''
      output.appendChild(img)
    })
  },
  concatMaps: () => {
    const map1 = {
      *[Symbol.iterator]() {
        yield ["Mike", 19]
        yield ["Taro", 24]
        yield ["Joe", 34]
      }     
    }
    const map2 = new Map([
      ["Jiro", 45],
      ["Mike", 30],
      ["Pico", 20]
    ])
    console.log(`map2["Jiro"]=${map2["Jiro"]}, map2.get("Jiro")=${map2.get("Jiro")}`)

    const map3 = new Map([
      [0, "Java"],
      [1, "Rust"],
      [2, "Python"]
    ])

    const result = concatMaps(map1, map2, map3)
    console.log(`result=${result}`)
    console.log(`JSON.stringify(result)=${JSON.stringify(result)}`)
    // Object.fromEntriesではキーが常に文字列にされる。すなわち元の情報が失われる。
    console.log(`Object.fromEntries(result)=${Object.fromEntries(result)}`)
    console.log(`JSON.stringify([...result])=${JSON.stringify([...result])}`)

    const output = document.querySelector(('.iterator-concat-sample .output'))
    output.textContent = JSON.stringify([...result])
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
    console.error(err)
    alert(err.detail)
  })
}

const main = () => {
  addListener()
}

main()

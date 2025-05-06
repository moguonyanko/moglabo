/**
 * @fileoverview Iterator関連のAPIを試すサンプルコード
 */

// DOM

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
}

const main = () => {
  addListener()
}

main()

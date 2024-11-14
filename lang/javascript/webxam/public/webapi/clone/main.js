/**
 * @fileoverview clone関係のAPIを確認するためのスクリプト
 * 参考:
 * https://developer.mozilla.org/ja/docs/Web/API/Window/structuredClone
 */

// TODO: structuredCloneの結果が空のオブジェクトになる。
class MyNode {
  #value
  #node

  constructor(value, node) {
    this.#value = value
    this.#node = node
  }

  get node() {
    return structuredClone(this.#node)
  }

  set node(_node) {
    this.#node = _node
  }

  toJSON() {
    return this.#value
  }
}

const funcs = {
  getStructuredClone: () => {
    const node1 = { value: 'HELLO' }
    // 循環参照を意図的に作る。
    node1.node = node1 
    const node1_2 = structuredClone(node1)
    console.log(node1_2)

    const output = document.querySelector('.structuredClone .output')
    // ディープコピーされているので結果はfalseになる。
    output.innerHTML = `node1 === node1_2 => ${node1 === node1_2}<br />`
    // コピーなので同じ値を持っている。
    output.innerHTML += `node1_2.value => ${node1_2.value}<br />`
    output.innerHTML += `node1.value === node1_2.value => ${node1.value === node1_2.value}<br />`
    // 循環参照が保持されているのでtrueになる。
    output.innerHTML += `node1.node === node1 => ${node1.node === node1}<br />`

    output.innerHTML += 'node1.valueを変更<br />'
    node1.value = 'MODIFIED'
    // ディープコピーなので変更の影響を受けない。
    output.innerHTML += `node1_2.value => ${node1_2.value}<br />`
    output.innerHTML += `node1.value === node1_2.value => ${node1.value === node1_2.value}<br />`
  },
  transferObject: () => {
    const output = document.querySelector('.transferObjectSample .output')

    const uintArray = Uint8Array.from({
      length: 1024 * 1024 * 16
    }, (value, index) => index)

    console.log(uintArray)
    output.innerHTML = `uintArray.byteLength = ${uintArray.byteLength}<br />`
    output.innerHTML += 'structuredCloneで転送<br />'

    const transferdObj = structuredClone(uintArray, {
      transfer: [uintArray.buffer]
    })
    output.innerHTML += `transferdObj.byteLength = ${transferdObj.byteLength}<br />`
    output.innerHTML += `uintArray.byteLength = ${uintArray.byteLength}<br />`

    try {
      // 転送元バッファから配列を作成するとエラー
      const errObj = new Uint8Array(uintArray.buffer)
      output.innerHTML += `errObj.byteLength = ${errObj.byteLength}<br />`
    } catch(err) {
      output.innerHTML += `${err.message}`
    }
  }
}

const init = () => {
  const main = document.querySelector('main')
  main.addEventListener('click', event => {
    if (typeof funcs[event.target.id] === 'function') {
      event.stopPropagation()
      funcs[event.target.id]()
    }
  })
}

init()

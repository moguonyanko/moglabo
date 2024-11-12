/**
 * @fileoverview clone関係のAPIを確認するためのスクリプト
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
    const node1 = { value: 'NODE1' }
    // 循環参照を意図的に作る。
    node1.node = node1 
    const node1_2 = structuredClone(node1)
    console.log(node1_2)

    const output = document.querySelector('.structuredClone .output')
    // ディープコピーされているので結果はfalseになる。
    output.innerHTML = `node1 === node1_2 => ${node1 === node1_2}<br />`
    // コピーなので同じ値を持っている。
    output.innerHTML += `node1.value === node1_2.value => ${node1.value === node1_2.value}<br />`
    // 循環参照が保持されているのでtrueになる。
    output.innerHTML += `node1.node === node1 => ${node1.node === node1}<br />`
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

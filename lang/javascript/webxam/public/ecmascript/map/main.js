/**
 * @fileoverview Map調査用スクリプト
 */

class Member {
  #name = ''
  #age = -1
  constructor(name, age) {
    this.#name = name
    this.#age = age
  }

  get name() {
    return this.#name
  }

  get age() {
    return this.#age
  }

  isAdult() {
    return this.#age >= 18
  }
  
  /**
   * プライベートな変数をJSON.stringifyで返すには必要。
   */
  toJSON() {
    return {
      name: this.#name,
      age: this.#age
    }
  }
}

const getSampleMembers = () => {
  return [
    new Member('Joe', 17),
    new Member('Taro', 18),
    new Member('Rico', 34),
    new Member('Jiro', 23),
    new Member('Mike', 16)
  ]
}

const funcs = {
  groupBy: () => {
    const members = getSampleMembers()
    /**
     * MapからJSONを得る方法の参考:
     * https://bobbyhadz.com/blog/javascript-convert-map-to-json
     */
    const mapOutput = document.querySelector('*[data-event-output=groupBy]')
    const mapResult = Map.groupBy(members, member => member.isAdult() ? 'adult' : 'child')
    mapOutput.textContent = JSON.stringify(Object.fromEntries(mapResult), null, '\t')
  }
}

const addListener = () => {
  const main = document.querySelector('main')
  main.addEventListener('click', event => {
    const { eventTarget } = event.target.dataset
    if (typeof funcs[eventTarget] === 'function') {
      event.stopPropagation()
      funcs[eventTarget]()
    }
  })
}

addListener()

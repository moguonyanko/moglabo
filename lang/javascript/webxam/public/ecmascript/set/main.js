/**
 * @fileoverview Setの動作を確認するためのスクリプト
 * 参考:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
 */

const init = () => {
  const getSet = id => {
    return new Set(document.getElementById(id).value.split(','))
  }

  const displayResult = result => {
    const output = document.querySelector('.output')
    if (result instanceof Set) {
      output.textContent = Array.from(result).join()
    } else {
      output.textContent = result
    }
  }

  const runSetFunc = value => {
    const setA = getSet('setA')
    if (typeof setA[value] === 'function') {
      const setB = getSet('setB')
      const result = setA[value](setB)
      displayResult(result)
    } else {
      displayResult(`${value}は未実装`)
    }
  }

  document.querySelector('.methodContainer').addEventListener('click', event => {
    displayResult()
    const { value } = event.target
    if (!value) {
      return 
    }
    runSetFunc(value)
  })

  Array.from(document.querySelectorAll('*[name=setMethod]'))
    .filter(ele => ele.checked)
    .forEach(ele => runSetFunc(ele.value))
}

init()

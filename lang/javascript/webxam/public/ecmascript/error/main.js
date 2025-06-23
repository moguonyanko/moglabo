/**
 * @fileoverview Error関連のAPIを調べるためのスクリプト
 */

const onInit = {
  isError: () => {
    const output = document.querySelector('.is-error-example .output')
    const error = new Error('This is a test error');
    output.textContent = `Is Error object is true error instance? : ${Error.isError(error)}`
  }  
}

const init = () => {
  Object.values(onInit).forEach(func => {
    if (typeof func === 'function') {
      func()
    }
  })
}

init()

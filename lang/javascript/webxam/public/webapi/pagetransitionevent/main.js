/**
 * @fileoverview PagetraasitionEventを調査するためのスクリプト
 */

const funcs = {
  pagehide: () => {
    const current = parseInt(localStorage.getItem('hidecount'))
    if (isNaN(current)) {
      localStorage.setItem('hidecount', 0)
    } else {
      localStorage.setItem('hidecount', current + 1)
    }
  },
  pageshow: () => {
    const output = document.querySelector('.output')
    const value = localStorage.getItem('hidecount')
    if (!isNaN(parseInt(value))) {
      output.textContent += `${value}回隠されました`
    }
  }
};

Object.keys(funcs).forEach(key => {
  window.addEventListener(key, funcs[key])
})

// unloadイベントのイベントリスナーを登録するとbfcacheが無効化される。
//window.addEventListener('unload', () => {})

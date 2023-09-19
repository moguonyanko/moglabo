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
  pageshow: event => {
    const output = document.querySelector('.output')
    if (event.persisted) {
      output.textContent = 'bfcache使用不可能'
      return
    }
    const value = localStorage.getItem('hidecount')
    if (!isNaN(parseInt(value))) {
      // +=にすると追記されてしまう。bfcacheは各要素への入力内容もキャッシュから取得して再現するため。
      output.textContent = `${value}回隠されました`
    }
  }
};

const noop = () => {};

// unloadイベントのイベントリスナーを登録するとbfcacheが無効化される。
const enableBfCache = enable => {
  if (enable) {
    window.removeEventListener('unload', noop)
  } else {
    window.addEventListener('unload', noop)
  }
};

const addListener = () => {
  Object.keys(funcs).forEach(key => {
    window.addEventListener(key, funcs[key])
  })
  
  document.querySelector('main').addEventListener('click', event => {
    const { eventTarget } = event.target.dataset
    if (eventTarget === 'enablebfcache') {
      event.stopPropagation()
      enableBfCache(event.target.checked)
    }
  });
}

addListener()

/**
 * @fileoverview JavaScriptのリソース管理関連APIを調べるためのスクリプトです。
 */

class SampleTextReader {
  read() {
    return 'read sample text'
  }

  releaseLock() {
    return 'Lock released'
  }
}

const actions = {
  sampleResourceManagementClicked: event => {
    const output = document.querySelector('.using-simple-example .output')

    using sampleResource = {
      reader: new SampleTextReader(),
      [Symbol.dispose]() {
        const text = this.reader.releaseLock()
        output.innerHTML += `<br />${text}`
      }
    }
    const { reader } = sampleResource

    // リソースを使用するブロックのスコープが分離されていなくても自動でリソース解放される。
    // {
    const text = reader.read()
    output.textContent = text
    // }

    // 自動でリソースが解放される
  }
}

const init = () => {
  document.querySelector('main').addEventListener('click', event => {
    const { action } = event.target.dataset
    const actionFunction = actions[action]
    if (typeof actionFunction === 'function') {
      event.stopPropagation()
      actionFunction(event)
    }
  })
}

init()

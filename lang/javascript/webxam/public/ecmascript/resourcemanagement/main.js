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

const getSampleResource = callback => {
  return {
    reader: new SampleTextReader(),
    [Symbol.dispose]() {
      const text = this.reader.releaseLock()
      callback(text)
    }
  }
}

const actions = {
  sampleResourceManagementClicked: event => {
    const output = document.querySelector('.using-simple-example .output')

    using sampleResource = getSampleResource(text => {
      output.innerHTML += `<br />${text}`
    })

    const { reader } = sampleResource

    // Javaのtry-with-resourcesのようにリソースを使用するブロックのスコープが明示的に分離されていなくても、
    // usingで指定した変数のガベージコレクションが実行されるタイミングでリソースが解放される。
    // {
    const text = reader.read()
    output.textContent = text
    // }

    // 自動でリソースが解放される
  },
  disposableStackSampleClicked: () => {
    const output = document.querySelector('.disposable-stack-example .output')

    {
      using useStack = new DisposableStack()
      useStack.use(getSampleResource(text => {
        output.innerHTML += `use:${text}<br />`
      }))
    }

    {
      using adoptStack = new DisposableStack()
      adoptStack.adopt(new SampleTextReader(), reader => {
        const releasedResult = reader.releaseLock()
        output.innerHTML += `adopt:${releasedResult}<br />`
      })
    }

    {
      using deferStack = new DisposableStack()
      deferStack.defer(() => {
        output.innerHTML += `defer<br />`
      })
    }

    {
      using beforeMoveStack = new DisposableStack()
      beforeMoveStack.adopt(new SampleTextReader(), reader => {
        const releasedResult = reader.releaseLock()
        output.innerHTML += `moved:${releasedResult}<br />`
      })
      using afterMoveStack = beforeMoveStack.move()
    }

    {
      const disposeStack = new DisposableStack()
      disposeStack.use(getSampleResource(text => {
        output.innerHTML += `dispose:${text}<br />`
      }))
      disposeStack.dispose()
    }
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

/**
 * @fileoverview
 * expr-evalの動作確認を行うためのブラウザ側スクリプトです。
 */

const listeners = {
  onEvilAction: async () => {
    const base = '.expr-eval-evil-simple-sample'
    const url = '/webxam/apps/practicenode/expr-eval-evil'
    const expression = document.querySelector(`${base} .sample-expression`).value;

    if (!expression || expression.length <= 0) {
      return
    }

    const response = await fetch(url + `?expression=${encodeURIComponent(expression)}`)
    const json = await response.json()

    const output = document.querySelector(`${base} .output`)
    const { legal_result, illegal_result } = json
    output.innerHTML = `<p>Legal Result: ${legal_result}</p>
    <p>Illegal Result: ${illegal_result}</p>`
  }
}

const init = () => {
  const main = document.querySelector('main')

  main.addEventListener('click', async event => {
    const { eventListener } = event.target.dataset
    if (typeof listeners[eventListener] === 'function') {
      try {
        event.target.setAttribute('disabled', 'true')
        await listeners[eventListener]()
      } finally {
        event.target.removeAttribute('disabled')
      }
    }
  })
}

init()  
/**
 * @fileoverview forgeライブラリのサンプルコード
 */

const getSourceText = () => {
  const ele = document.getElementById('source-text')
  return ele.value
}

const listeners = {
  onCipherErrorButtonClicked: async () => {
    const url = '/webxam/apps/practicenode/forge-cipher-error-with-aescbc'

    const response = await fetch(url)
    const result = await response.json()

    const output = document.querySelector('.forge-simple-sample .output')
    output.textContent = JSON.stringify(result)
  },
  onCipherInvalidValueClicked: async () => {
    const url = '/webxam/apps/practicenode/forge-cipher-invalid-value-with-aescbc'
    
    const response = await fetch(`${url}?source=${getSourceText()}`)
    const result = await response.json()
    console.log(result)
    const { encryptedLength } = result

    const output = document.querySelector('.forge-simple-sample .output')
    output.textContent = `16バイトになるはずだが、${encryptedLength}バイトになっている。`
  },
  onCipherWebCryptoApiClicked: async () => {
    const url = '/webxam/apps/practicenode/webcryptoapi-cipher-with-aescbc'
    
    const response = await fetch(`${url}?source=${getSourceText()}`)
    const result = await response.json()
    console.log(result)
    const { encryptedLength } = result

    const output = document.querySelector('.forge-simple-sample .output')
    output.textContent = `16バイトになるはずであり、正しく${encryptedLength}バイトになっている。`
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

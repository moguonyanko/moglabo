/**
 * @fileoverview forgeライブラリのサンプルコード。比較のためWebCryptoAPIの検証も行う。
 * 
 */

const getSourceText = () => {
  const ele = document.getElementById('source-text')
  return ele.value
}

const initialVectors = {}

const requestEncrypt = async url => {
    const response = await fetch(`${url}?source=${getSourceText()}`)
    const result = await response.json()
    console.log(result)

    const { encryptedBytes, encryptedBuffer, ivBase64 } = result
    document.getElementById('encrypted-text').value = encryptedBuffer
    initialVectors[encryptedBuffer] = ivBase64

    const output = document.querySelector('.forge-simple-sample .output')
    output.textContent = JSON.stringify(encryptedBytes)
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
    requestEncrypt(url)
  },
  onCipherWebCryptoApiClicked: async () => {
    const url = '/webxam/apps/practicenode/webcryptoapi-cipher-with-aescbc'
    requestEncrypt(url)
  },
  onDeCipherWebCryptoApiClicked: async () => {
    const output = document.querySelector('.forge-simple-sample .output')
    const url = '/webxam/apps/practicenode/webcryptoapi-decipher-with-aescbc'

    const buffer = document.getElementById('encrypted-text').value
    const ivBase64 = initialVectors[buffer]

    if (!ivBase64) {
      output.textContent = 'ivが存在しません。'
      return
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source: buffer,
        ivBase64
      })
    })
    const result = await response.json()
    console.log(result)
    const { decryptedText } = result

    output.textContent = decryptedText
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

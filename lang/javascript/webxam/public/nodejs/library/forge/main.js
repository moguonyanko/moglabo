/**
 * @fileoverview forgeライブラリのサンプルコード
 */

const getSourceText = () => {
  const ele = document.getElementById('source-text')
  return ele.value
}

/**
 * ArrayBuffer (または Uint8Array) を Base64 文字列に変換するヘルパー関数
 * @param {ArrayBuffer | Uint8Array} buffer - 送信したいバイナリデータ
 * @returns {string} Base64 エンコードされた文字列
 */
const arrayBufferToBase64 = buffer => {
  // Uint8Arrayが渡された場合、.buffer を使用して ArrayBuffer にアクセス
  const arrayBuffer = buffer.buffer instanceof ArrayBuffer ? buffer.buffer : buffer;
    
  // ArrayBufferをバイト列として扱い、それを基にBase64に変換
  let binary = '';
  const bytes = new Uint8Array(arrayBuffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  // ブラウザの組み込み関数 btoa() で Base64 にエンコード
  return btoa(binary);
}

const ivs = {}

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
    const { encryptedBytes } = result

    const output = document.querySelector('.forge-simple-sample .output')
    output.textContent = JSON.stringify(encryptedBytes)
  },
  onCipherWebCryptoApiClicked: async () => {
    const url = '/webxam/apps/practicenode/webcryptoapi-cipher-with-aescbc'
    
    const response = await fetch(`${url}?source=${getSourceText()}`)
    const result = await response.json()
    console.log(result)
    const { encryptedBytes, encryptedBuffer, ivBase64 } = result
    document.getElementById('encrypted-text').value = encryptedBuffer
    ivs[encryptedBuffer] = ivBase64

    const output = document.querySelector('.forge-simple-sample .output')
    output.textContent = JSON.stringify(encryptedBytes)
  },
  onDeCipherWebCryptoApiClicked: async () => {
    const url = '/webxam/apps/practicenode/webcryptoapi-decipher-with-aescbc'

    const buffer = document.getElementById('encrypted-text').value
    const ivBase64 = ivs[buffer]

    if (!ivBase64) {
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

    const output = document.querySelector('.forge-simple-sample .output')
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

/**
 * @fileoverview 画像生成を試すためのスクリプト
 */

const getGeneratedImageBlob = async contents => {
  const response =  await fetch('/brest/genaiapi/generate/image/', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents
    })
  })
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message)
  }
  const contentType = response.headers.get('Content-Type')
  if (contentType.startsWith('image')) {
    return await response.blob()    
  } else {
    throw new Error(await response.text())
  }
}

// DOM

const listeners = {
  generateImage: async () => {
    const contents = document.querySelector('.prompt').textContent
    const output = document.querySelector('.simple-generation-image .output')
    output.textContent = ''
    try {
      const blob = await getGeneratedImageBlob(contents)
      const imgUrl = URL.createObjectURL(blob)
      const img = new Image()
      img.onload = () => {
        URL.revokeObjectURL(imgUrl)
        output.appendChild(img)
      }
      img.src = imgUrl  
    } catch (err) {
      output.textContent = err.message
      const evt = new CustomEvent('generateimageerror', {
        detail: err.message
      })
      window.dispatchEvent(evt)
    }
  }
}

const init = () => {
  document.body.addEventListener('click', async event => {
    const { eventListener } = event.target.dataset
    await listeners[eventListener]?.()
  })

  window.addEventListener('generateimageerror', err => {
    alert(err.detail)
  })
}

init()

/**
 * @fileoverview 画像生成を試すためのスクリプト
 */

const getImageText = response => {
  const header = response.headers.get('x-generation-image-text')
  const text = decodeURIComponent(header)
  return text
}

const requestImage = async contents => {
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

  const text = getImageText(response)

  const contentType = response.headers.get('Content-Type')
  if (contentType.startsWith('image')) {
    return { image: await response.blob(), text }    
  } else {
    throw new Error(await response.text())
  }
}

const getGeneratedImage = contents => {
  return new Promise(async (resolve, reject) => {
    const result = await requestImage(contents)
    const imgUrl = URL.createObjectURL(result.image)
    const image = new Image()
    image.onload = () => {
      image.width = image.naturalWidth
      image.height = image.naturalHeight
      URL.revokeObjectURL(imgUrl)
      resolve({ image, text: result.text })
    }
    image.onerror = reject
    image.src = imgUrl
  })
}

// DOM

const listeners = {
  generateImage: async () => {
    const contents = document.querySelector('.prompt').textContent
    const output = document.querySelector('.simple-generation-image .output')
    output.textContent = ''
    const info = document.querySelector('.simple-generation-image .info')
    info.textContent = ''
    try {
      const result = await getGeneratedImage(contents)
      info.textContent = result.text
      output.appendChild(result.image)
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
    console.error('generateimageerror', err)
  })
}

init()

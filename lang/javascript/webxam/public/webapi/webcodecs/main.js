/**
 * @fileoverview WebCodecs APIを調査するためのスクリプト
 * 参考:
 * https://developer.chrome.com/docs/web-platform/best-practices/webcodecs?hl=ja
 * https://developer.mozilla.org/en-US/docs/Web/API/ImageDecoder
 */
/* eslint-disable no-undef */

const fileToUint8Array = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = event => {
      const arrayBuffer = event.target.result
      const array = new Uint8Array(arrayBuffer)
      resolve(array)
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

let timeoutId

const getSampleCanvas = () => {
  const canvas = document.querySelector('.imageDecoder .output')
  const canvasContext = canvas.getContext('2d')
  return {
    canvas, canvasContext
  }
}

/**
 * TODO: 読み込んだ画像が元の画像と同じサイズで描画されない。
 */
const renderImage = async (result, imageDecoder, imageIndex, speed) => {
  const { canvasContext } = getSampleCanvas()
  canvasContext.drawImage(result.image, 0, 0)

  const track = imageDecoder.tracks.selectedTrack

  // 終了チェック
  if (imageDecoder.complete) {
    if (track.frameCount === 1) {
      return
    }
    if (imageIndex + 1 >= track.frameCount) {
      imageIndex = 0
    }
  }

  const nextResult = await imageDecoder.decode({ frameIndex: ++imageIndex })
  try {
    // requestAnimationFrame単体ではアニメーションの繰り返し速度を調整できない。
    timeoutId = setTimeout(async () => {
      await renderImage(nextResult, imageDecoder, imageIndex, speed)
    }, result.image.duration / speed)  
  } catch (err) {
    if (err instanceof RangeError) {
      imageIndex = 0
      const result = imageDecoder.decode({ frameIndex: imageIndex })
      await renderImage(result, imageDecoder, imageIndex, speed)
    } else {
      throw err
    }
  }
}

const funcs = {
  decodeImage: async () => {
    const selectedFiles = document.getElementById('decodeTargetImage').files
    if (selectedFiles.length === 0) {
      return
    }
    funcs.clearImage()
    const file = selectedFiles[0]
    const uint8Array = await fileToUint8Array(file)
    const imageDecoder = new ImageDecoder({ data: uint8Array, type: file.type })
    const imageIndex = 0
    const result = await imageDecoder.decode({ frameIndex: imageIndex })
    const speedEles = document.getElementsByName('animationSpeed')
    const speed = parseFloat(Array.from(speedEles).filter(ele => ele.checked)[0].value)
    await renderImage(result, imageDecoder, imageIndex, speed)
  },
  clearImage: () => {
    if (!timeoutId) {
      return
    }
    clearTimeout(timeoutId)
    timeoutId = null
    const { canvas, canvasContext } = getSampleCanvas()
    canvasContext.clearRect(0, 0, canvas.clientWidth, canvas.height)  
  }
}

const init = () => {
  document.querySelector('main').addEventListener('click', async event => {
    const { eventFunction } = event.target.dataset
    if (typeof funcs[eventFunction] === 'function') {
      event.stopPropagation()
      await funcs[eventFunction]()
    }
  })
}

init()

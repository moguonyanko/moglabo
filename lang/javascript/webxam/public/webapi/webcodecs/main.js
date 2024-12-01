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

/**
 * TODO: 読み込んだ画像が元の画像と同じサイズで描画されない。
 */
const renderImage = (result, imageDecoder, imageIndex) => {
  const canvas = document.querySelector('.imageDecoder .output')
  const canvasContext = canvas.getContext('2d')
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

  const speed = 3000.0 // 大きくするほどGIFアニメの速度が増す。1000.0では等速になる。

  imageDecoder.decode({ frameIndex: ++imageIndex })
    .then((nextResult) =>
      setTimeout(() => {
        renderImage(nextResult, imageDecoder, imageIndex)
      }, result.image.duration / speed)
    )
    .catch((err) => {
      if (err instanceof RangeError) {
        imageIndex = 0
        imageDecoder.decode({ frameIndex: imageIndex })
          .then(result => renderImage(result, imageDecoder, imageIndex))
      } else {
        throw err
      }
    })  
}

const funcs = {
  decodeImage: async () => {
    const selectedFiles = document.getElementById('decodeTargetImage').files
    if (selectedFiles.length === 0) {
      return
    }
    const file = selectedFiles[0]
    const uint8Array = await fileToUint8Array(file)
    const imageDecoder = new ImageDecoder({ data: uint8Array, type: file.type })
    const imageIndex = 0
    imageDecoder.decode({ frameIndex: imageIndex })
      .then((result => renderImage(result, imageDecoder, imageIndex)))
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

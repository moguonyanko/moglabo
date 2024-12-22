/**
 * @fileoverview MediaStreamの調査をするためのスクリプトです。
 * 参考:
 * https://developer.mozilla.org/ja/docs/Web/API/Screen_Capture_API/Using_Screen_Capture
 * 
 */

const defaultDisplayMediaOptions = {
  video: {
    displaySurface: "window",
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 44100,
    suppressLocalAudioPlayback: true,
  },
  surfaceSwitching: "include",
  selfBrowserSurface: "exclude",
  systemAudio: "exclude",
}

const captureResult = document.querySelector('.captureResult')

const dumpOptionsInfo = () => {
  const videoTrack = captureResult.srcObject.getVideoTracks()[0]

  const output = document.querySelector('.captureInfo')
  output.textContent = `Track settings:\n${JSON.stringify(videoTrack.getSettings(), null, 2)}\n
Track constraints:\n${JSON.stringify(videoTrack.getConstraints(), null, 2)}
  `
}

const linstners = {
  startCapture: async () => {
    captureResult.srcObject =
      await navigator.mediaDevices.getDisplayMedia(defaultDisplayMediaOptions)
    dumpOptionsInfo()
  },
  stopCapture: async () => {
    if (!captureResult.srcObject) {
      return
    }
    const tracks = captureResult.srcObject.getTracks()
    tracks.forEach((track) => track.stop())
    captureResult.srcObject = null
  }
}

const addListener = () => {
  const main = document.querySelector('main')
  main.addEventListener('click', async event => {
    const { eventListener } = event.target.dataset
    if (typeof linstners[eventListener] === 'function') {
      event.stopPropagation()
      await linstners[eventListener]()
    }
  })
}

addListener()


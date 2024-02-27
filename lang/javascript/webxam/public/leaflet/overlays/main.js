/**
 * @fileoverview いろいろなオーバーレイを重ねて表示確認するためのスクリプト
 * 参考:
 * https://leafletjs.com/examples/overlays/
 */
/* eslint-disable no-undef */

const addImageOverlay = map => {
  const imageUrl = '../../image/hello.png'
  const errorOverlayUrl = '../../image/errorimage.png'
  const latLngBounds = L.latLngBounds([[35.646159, 139.7542989], [35.666159, 139.7852989]])

  const imageOverlay = L.imageOverlay(imageUrl, latLngBounds, {
    opacity: 0.3,
    errorOverlayUrl,
    alt: 'サンプル画像',
    interactive: true
  }).addTo(map)
  console.log(imageOverlay)

  L.rectangle(latLngBounds).addTo(map)
  map.fitBounds(latLngBounds)
}

const addVideoOverlay = map => {
  const videoUrls = [
    '../../movie/samplenote.m4v'
  ]
  const errorOverlayUrl = '../../image/errorimage.png'
  const bounds = L.latLngBounds([[35.656159, 139.7552989], [35.666159, 139.7652989]])
  // fitBoundsしないと動画が地図上に表示されない。addToするだけでは足りないようだ。
  map.fitBounds(bounds)

  const videoOverlay = L.videoOverlay(videoUrls, bounds, {
    opacity: 1.0,
    errorOverlayUrl,
    interactive: true,
    autoplay: false,
    muted: true,
    playsInline: true
  }).addTo(map)

  videoOverlay.on('load', () => {
    class MyPauseControl extends L.Control {
      onAdd() {
        const button = L.DomUtil.create('button')
        button.title = '動画の一時停止'
        button.textContent = '一時停止'
        L.DomEvent.on(button, 'click', event => {
          // TODO: stopPropagationしてもダブルクリック時に地図拡大が発生してしまう。
          //event.stopPropagation()
          videoOverlay.getElement().pause()
        })
        return button
      }
    }

    class MyPlayControl extends L.Control {
      onAdd() {
        const button = L.DomUtil.create('button')
        button.title = '動画の再生'
        button.textContent = '再生'
        L.DomEvent.on(button, 'click', () => videoOverlay.getElement().play())
        return button
      }
    }

    const pauseControl = (new MyPauseControl()).addTo(map)
    const playControl = (new MyPlayControl()).addTo(map)
    console.log(pauseControl, playControl)
  })
}

const createSvgElement = () => {
  const ns = 'http://www.w3.org/2000/svg'
  const svgElement = document.createElementNS(ns, 'svg')
  svgElement.setAttribute('xmlns', ns)
  svgElement.setAttribute('viewBox', '0 0 200 200')
  const containerRect = document.createElementNS(ns, 'rect')
  containerRect.setAttribute('width', '200')
  containerRect.setAttribute('height', '200')
  containerRect.style = 'opacity:0.5'
  svgElement.appendChild(containerRect)
  const childRect1 = document.createElementNS(ns, 'rect')
  childRect1.setAttribute('x', '75')
  childRect1.setAttribute('y', '23')
  childRect1.setAttribute('width', '50')
  childRect1.setAttribute('height', '50')
  childRect1.style = 'fill:red'
  svgElement.appendChild(childRect1)
  const childRect2 = document.createElementNS(ns, 'rect')
  childRect2.setAttribute('x', '55')
  childRect2.setAttribute('y', '100')
  childRect2.setAttribute('width', '60')
  childRect2.setAttribute('height', '70')
  childRect2.style = 'fill:#88FFAA'
  svgElement.appendChild(childRect2)

  return svgElement
}

const addSvgOverlay = map => {
  const latLngBounds = L.latLngBounds([[35.646159, 139.7542989], [35.666159, 139.7852989]])
  map.fitBounds(latLngBounds)
  const svgOverlay = L.svgOverlay(createSvgElement(), latLngBounds, {
    opacity: 0.7,
    interactive: true
  }).addTo(map)
  console.log(svgOverlay)
}

const init = () => {
  const map = L.map('map', {
    renderer: L.canvas()
  })
  map.setView({ lat: 35.656159, lng: 139.7552989 }, 8)

  const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map)
  console.log(osm)

  addVideoOverlay(map)
  addSvgOverlay(map)
  addImageOverlay(map)
}

init()

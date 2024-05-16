/**
 * @fileoverview PreactとLeafletを組み合わせて地図表示するサンプル
 */
import { render, Component } from 'https://esm.sh/preact'
import { useState, useEffect } from 'https://esm.sh/preact/hooks'
import htm from 'https://esm.sh/htm'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from 'https://cdn.esm.sh/react-leaflet'
import { initMap } from '../leaflet_util.js'
import { html } from '../../preact/comcom.js'

/**
 * 管理するべき状態とその状態を変更する関数を切り出せる。
 */
const useMapSize = () => {
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)

  const size = { width, height }

  const setSize = ({width, height}) => {
    setWidth(width)
    setHeight(height)
  }

  const onResize = () => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }

  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, []);  

  return size
}

/**
 * TODO: Preactで制御するための状態を持たせてみる。
 */
class MyMap extends Component {
  #map
  #lat
  #lng
  #zoom

  constructor({ lat, lng, zoom }) {
    super()
    this.#lat = lat
    this.#lng = lng
    this.#zoom = zoom
  }

  componentDidMount() {
    this.#map = initMap({
      lat: this.#lat, lng: this.#lng, zoom: this.#zoom
    })
    console.log('Map initialized', this.#map)
    // ここでステートを参照するとエラーになる。render内でしか参照できないのか？
    // const size = useMapSize()
    // const popup = L.popup()
  	// 	.setLatLng([this.#lat, this.#lng])
	  // 	.setContent(`Width=${size.width}, Height=${size.height}`)
    //   .openOn(this.#map)
  }

  render() {
    const size = useMapSize()

    // Mapが初期化されていないのでポップアップが表示できない。
    // const popup = L.popup()
  	// 	.setLatLng([this.#lat, this.#lng])
	  // 	.setContent(`Width=${size.width}, Height=${size.height}`)
    //   .openOn(this.#map)

    // ページがレンダリングされていないので以下はエラーになる。
    //document.querySelector('main').innerHTML = `<p class="info">Width=${size.width}, Height=${size.height}</p>`

    // renderの戻り値以外でステートを参照してもエラーとなる。
    // if (size.width > size.height) {
    //   return html`<div id="map" class="hot"></div>`
    // } else {
    //   return html`<div id="map" class="cool></div>`
    // }

    // ステートはコンポーネントに埋め込んで使うしかない？
    return html`
        <p class="info">Width=${size.width}, Height=${size.height}</p>
        <div id="map" class=${size.width > size.height ? "hot" : "cool"}></div>
      `    
  }
}

/**
 * 以下は動作しない。react-leafletがPreactに対応していないようである。
 */
function MyMapByLibrary({ lat, lng, zoom, scrollWheelZoom = false }) {
  return html`
    <${MapContainer} center=${[lat, lng]} zoom=${zoom} scrollWheelZoom=${scrollWheelZoom}>
      <${TileLayer}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <${Marker} position=${[lat, lng]}>
        <${Popup}>
          A pretty CSS3 popup. <br /> Easily customizable.
        </${Popup}>
      </${Marker}>
    </${MapContainer}>`
}

const init = () => {
  const mapContainer = document.querySelector('.mapcontainer')
  const lat = 35.45562693113854
  const lng = 139.63408470153811
  const zoom = 14
  render(html`<${MyMap} lat="${lat}" lng="${lng}" zoom="${zoom}" />`, mapContainer)
}

init()

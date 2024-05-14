/**
 * @fileoverview PreactとLeafletを組み合わせて地図表示するサンプル
 */
import { render, Component } from 'https://esm.sh/preact'
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
 * TODO: Preactで制御するための状態を持たせてみる。
 */
class MyMap extends Component {
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
    const map = initMap({
      lat: this.#lat, lng: this.#lng, zoom: this.#zoom
    })
    console.log(map)
  }

  render() {
    return html`
        <div id="map"></div>
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

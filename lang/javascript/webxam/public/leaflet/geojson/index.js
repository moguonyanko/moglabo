/**
 * @fileoverview LeafletでGeoJSONのGeoJSONによる地物を描画するためのサンプルスクリト
 * 参考:
 * https://leafletjs.com/examples/geojson/
 */
/* eslint-disable no-undef */

const init = async () => {
  const [lat, lon] = [35.6815657, 139.7675949]
  const zoom = 14
  const map = L.map('map').setView([lat, lon], zoom)

  const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map)

  const features = await (await fetch('samplefeatures.json')).json()

  const onEachFeature = (feature, layer) => {
    const popupContent = `<strong>${feature.properties.message}</strong>`
    layer.bindPopup(popupContent)
  }

  L.geoJSON(features, {
    onEachFeature,
    style: feature => {
      return { color: 'red' }
    }
  }).addTo(map)
}

init().then()

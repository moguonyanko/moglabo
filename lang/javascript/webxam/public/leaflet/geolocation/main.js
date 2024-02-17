/**
 * @fileoverview LeafletでGPSでの位置検索を行うためのサンプルスクリプト
 * 参考:
 * https://leafletjs.com/examples/mobile/
 */
/* eslint-disable no-undef */

const init = () => {
  const [lat, lon] = [35.6815657, 139.7675949]
  const zoom = 14
  const map = L.map('map').setView([lat, lon], zoom)

  const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map)
  console.log(tiles)

  map.locate({
    setView: true,
    maxZoom: 16
  })

  const onLocationFound = event => {
    const { latlng, accuracy } = event

    L.marker(latlng).addTo(map)
      .bindPopup(`現在地は半径${accuracy.toFixed(3)}メートルの範囲内です`).openPopup()

    L.circle(latlng, accuracy).addTo(map)
  }

  map.on('locationfound', onLocationFound)

  const onLocationError = error => {
    alert(error.message)
  }

  map.on('locationerror', onLocationError)
}

init()

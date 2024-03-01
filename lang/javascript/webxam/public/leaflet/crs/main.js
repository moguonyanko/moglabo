/**
 * @fileoverview レイヤグループの動作確認をするためのスクリプト
 * 参考:
 * https://leafletjs.com/examples/layers-control/
 */
/* eslint-disable no-undef */

const init = () => {
  const map = L.map('map', {
    crs: L.CRS.Simple
  })

  const bounds = [[0, 0], [1000, 1000]]
  const image = L.imageOverlay('uqm_map_full.png', bounds).addTo(map)
  console.log(image)

  map.fitBounds(bounds);

  const sol = L.latLng(145.0, 175.2)
  const mizar = L.latLng(130.1, 41.6)
  const caeli = L.latLng(97.4, 294.5)
  const deneb = L.latLng(8.3, 218.7)

  L.marker(sol).addTo(map).bindPopup('Sol')
  L.marker(mizar).addTo(map).bindPopup('Mizar')
  L.marker(caeli).addTo(map).bindPopup('Caeli')
  L.marker(deneb).addTo(map).bindPopup('Deneb')
  const travel = L.polyline([sol, deneb]).addTo(map)
  console.log(travel)

  map.setView([100, 155], 1)

  const viewClickLatLng = evt => {
    console.log(evt)
    const { lat, lng } = evt.latlng
    const popup = L.popup()
    popup.setLatLng(evt.latlng)
      .setContent(`lat=${lat},lng=${lng}`)
      .openOn(map)
  }

  map.on('click', viewClickLatLng)
}

window.addEventListener('pageshow', init)

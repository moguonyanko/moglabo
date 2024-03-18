/**
 * @fileoverview Leaflet関連のユーティリティ関数をまとめたスクリプトです。
 */
/* eslint-disable no-undef */

const initMap = ({lat = 35.658043614238586, lng = 139.75555658340457, zoom = 16} = {}) => {
  const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  })

  const map = L.map('map', {
    renderer: L.canvas(),
    layers: [osm]
  })

  map.setView({ lat, lng }, zoom)

  const printClickLatLng = event => {
    const { lat, lng } = event.latlng
    const info = `lat: ${lat}, lng: ${lng}`
    console.log(info)
  }

  return map.on('click', printClickLatLng)
}

const loadJson = async path => await (await fetch(path)).json()

export {
  initMap,
  loadJson
}

/**
 * @fileoverview 線分と点の位置関係を調べるスクリプト
 */
/* eslint-disable no-undef */

const main = async () => {
  const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  })

  const response = await fetch('samplefeatures.json')
  const sampleFeatures = await response.json()
  console.log(sampleFeatures)

  const map = L.map('map', {
    renderer: L.canvas(),
    layers: [osm]
  })

  const onEachFeature = (feature, layer) => {
    const content = `<p>${feature.geometry.type}</p>${feature.geometry.coordinates}`
    layer.bindPopup(content)
  }

  L.geoJSON(sampleFeatures, {
    onEachFeature
  }).addTo(map)  

  map.setView({ lat: 35.657871, lng: 139.755138 }, 15)  
}

main().then()

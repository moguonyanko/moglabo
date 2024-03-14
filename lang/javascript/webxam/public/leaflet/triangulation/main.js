/**
 * @fileoverview 多角形の三角形分割を試すスクリプト
 */
/* eslint-disable no-undef */

let trianglationLayer = null

const resetTriangulation = () => {
  if (trianglationLayer) {
    trianglationLayer.remove()
  }
}

const listeners = {
  drawTriangulation: async (map, rectangle) => {
    resetTriangulation()
    const response = await fetch('/brest/gis/triangulation/', {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rectangle)
    })
    const { result } = await response.json()
    trianglationLayer = L.geoJSON(result, {
      style: () => {
        return {
          color: 'black',
          fillColor: 'rgba(255,0,0,0.7)'
        }
      }
    }).addTo(map)
  },
  resetTriangulation
}

const addListener = (map, rectangle) => {
  document.querySelector('main').addEventListener('click', async event => {
    const { eventName } = event.target.dataset
    if (typeof listeners[eventName] === 'function') {
      await listeners[eventName](map, rectangle)
    }
  })
}

const initMap = () => {
  const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  })

  const map = L.map('map', {
    renderer: L.canvas(),
    layers: [osm]
  })

  map.setView({ lat: 35.658043614238586, lng: 139.75555658340457 }, 16)

  const printClickLatLng = event => {
    const { lat, lng } = event.latlng
    const info = `lat: ${lat}, lng: ${lng}`
    console.log(info)
  }

  return map.on('click', printClickLatLng)
}

const drawRectangle = (map, rectangle) => {
  L.geoJSON([rectangle]).addTo(map)  
}

const main = async () => {
  const map = initMap()
  const loadGeoJson = async path => await (await fetch(path)).json()
  const rectangle = await loadGeoJson('rectangle.json')
  drawRectangle(map, rectangle)
  addListener(map, rectangle)
}

main().then()

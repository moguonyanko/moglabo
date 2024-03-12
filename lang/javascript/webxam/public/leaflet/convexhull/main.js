/**
 * @fileoverview 凸包計算用スクリプト
 */

const main = async () => {
  const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  })

  const map = L.map('map', {
    renderer: L.canvas(),
    layers: [osm]
  })

  const loadGeoJson = async path => await (await fetch(path)).json()
  const multipoint = await loadGeoJson('multipoint.json')

  let convexfullLayer = null

  const clearConvexhull = () => {
    if (convexfullLayer) {
      convexfullLayer.remove()
    }
  }

  const funcs = {
    drawConvexhull: async () => {
      clearConvexhull()
      const response = await fetch('/brest/gis/convexhull/', {
        method: 'POST',
        mode: 'cors',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(multipoint)
      })
      const { result } = await response.json()
      convexfullLayer = L.geoJSON([result]).addTo(map)
    },
    clearConvexhull
  }

  document.querySelector('main').addEventListener('click', async event => {
    const { eventTarget } = event.target.dataset
    if (typeof funcs[eventTarget] === 'function') {
      await funcs[eventTarget]()
    }
  })

  // CircleMarkerでGeoJSONのPointをCanvasに描画するときのスタイル。
  // 通常のMarkerだとimg要素で追加されるため数が多い場合にパフォーマンスが低下する。
  const circleMarkerStyle = {
    radius: 8,
    fillColor: 'green',
    color: 'black',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }

  L.geoJSON([multipoint], {
    // MarkerではなくCircleMarkerで描画させるためにpointToLayerを定義する。
    pointToLayer: (feature, latlng) => {
      return L.circleMarker(latlng, circleMarkerStyle);
    }
  }).addTo(map)

  map.setView({ lat: 35.65910479239084, lng: 139.7561359405518 }, 15)

  const viewClickLatLng = evt => {
    const { lat, lng } = evt.latlng
    const info = `lat: ${lat}, lng: ${lng}`
    console.log(info)
  }

  map.on('click', viewClickLatLng)
}

main().then()

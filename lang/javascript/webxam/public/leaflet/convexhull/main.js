/**
 * @fileoverview 凸包計算用スクリプト
 * Windowオブジェクトに公開されてしまっている関数や変数が多いがサンプルなので放置する。
 * もし気になるならscript要素のtype属性にmoduleを指定すればいい。
 */

let convexfullLayer = null

const clearConvexhull = () => {
  if (convexfullLayer) {
    convexfullLayer.remove()
  }
}

const listeners = {
  drawConvexhull: async (map, multipoint) => {
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

const addListener = (map, multipoint) => {
  document.querySelector('main').addEventListener('click', async event => {
    const { eventName } = event.target.dataset
    if (typeof listeners[eventName] === 'function') {
      await listeners[eventName](map, multipoint)
    }
  })
}

const drawMarker = (map, multipoint) => {
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

  map.setView({ lat: 35.65910479239084, lng: 139.7561359405518 }, 15)

  const viewClickLatLng = event => {
    const { lat, lng } = event.latlng
    const info = `lat: ${lat}, lng: ${lng}`
    console.log(info)
  }
  
  return map.on('click', viewClickLatLng)
}

const main = async () => {
  const map = initMap()
  const loadGeoJson = async path => await (await fetch(path)).json()
  const multipoint = await loadGeoJson('multipoint.json')
  addListener(map, multipoint)
  drawMarker(map, multipoint)
}

main().then()

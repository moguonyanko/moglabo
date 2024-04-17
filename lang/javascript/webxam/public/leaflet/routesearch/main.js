/**
 * @fileoverview 経路探索を練習するためのスクリプト
 */
/* eslint-disable no-undef */

import { initMap, loadJson } from '../leaflet_util.js'

let resultRouteSearchLayer = null

const reset = () => {
  resultRouteSearchLayer?.remove()
}

const listeners = {
  executeRouteSearch: async (map, start, goal) => {
    resultRouteSearchLayer?.remove()
    /**
     * @todo
     * 現在の表示範囲全体を探索範囲としてしまうので小縮尺にすればするほど遅くなってしまう。
     */
    const bounds = map.getBounds()
    const bbox = [
      bounds.getNorth(), bounds.getSouth(), bounds.getEast(), bounds.getWest()
    ]
    const response = await fetch('/brest/gis/routesearch/', {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start, goal, bbox
      })
    })
    const { path } = await response.json()
    console.log(path)
    resultRouteSearchLayer = L.geoJSON(path).addTo(map)
  },
  reset
}

const addListener = (map, start, goal) => {
  document.querySelector('main').addEventListener('click', async event => {
    const { eventName } = event.target.dataset
    if (typeof listeners[eventName] === 'function') {
      await listeners[eventName](map, start, goal)
    }
  })
}

const main = async () => {
  const map = initMap({
    lat: 35.45562693113854, lng: 139.63408470153811, zoom: 14
  })
  const start = await loadJson('start.json')
  const goal = await loadJson('goal.json')
  L.geoJSON([start, goal], {
    pointToLayer: (feature, latlng) => {
      return L.circleMarker(latlng, {
        radius: 10,
        fillColor: feature.properties.start ? 'blue' : 'red',
        color: 'black',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      })
    }
  }).addTo(map)

  addListener(map, start, goal)
}

main().then()

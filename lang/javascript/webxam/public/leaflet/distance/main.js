/**
 * @fileoverview 距離計算を練習するためのスクリプト
 */
/* eslint-disable no-undef */

import { initMap, loadJson } from '../leaflet_util.js'

let resultDistanceLayer = null

const reset = () => {
  resultDistanceLayer?.remove()
}

const listeners = {
  calcDistance: async (map, start, goal) => {
    resultDistanceLayer?.remove()
    const response = await fetch('/brest/gis/distance/', {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start, goal
      })
    })
    const json = await response.json()
    console.log(json)
    resultDistanceLayer = L.geoJSON(json.line).addTo(map)
      .bindPopup(`${json.distance}メートル`).openPopup()
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
    lat: 35.65705509430775, lng: 139.75278347383278, zoom: 15
  })
  const start = await loadJson('start.json')
  const goal = await loadJson('goal.json')
  L.geoJSON([start, goal], {
    pointToLayer: (feature, latlng) => {
      return L.circleMarker(latlng, {
        radius: 10,
        fillColor: feature.properties.id == 1 ? 'blue' : 'red',
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

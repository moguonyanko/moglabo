/**
 * @fileoverview 近傍点検索を試すためのスクリプト
 */
/* eslint-disable no-undef */

import { initMap, loadJson, getRandomRgb } from '../leaflet_util.js'

let nearestPointLayer = null

const reset = () => {
  if (nearestPointLayer) {
    nearestPointLayer.remove()
  }
}

const listeners = {
  drawNearestPoint: async (map, points, line) => {
    reset()
    const response = await fetch('/brest/gis/nearestpoint/', {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        points,
        line
      })
    })
    let { result } = await response.json()
    const circleMarkerStyle = {
      radius: 10,
      fillColor: 'red',
      color: 'black',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }
    nearestPointLayer = L.geoJSON(result, {
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, circleMarkerStyle)
      }
    }).addTo(map)
  },
  reset
}

const addListener = (map, polygon, line) => {
  document.querySelector('main').addEventListener('click', async event => {
    const { eventName } = event.target.dataset
    if (typeof listeners[eventName] === 'function') {
      await listeners[eventName](map, polygon, line)
    }
  })
}

const main = async () => {
  const map = initMap({
    lat: 35.653769701601675, lng: 139.75437641143802, zoom: 15
  })
  const points = await loadJson('points.json')
  L.geoJSON([points]).addTo(map)
  const line = await loadJson('line.json')
  L.geoJSON([line]).addTo(map)


  addListener(map, points, line)
}

main().then()

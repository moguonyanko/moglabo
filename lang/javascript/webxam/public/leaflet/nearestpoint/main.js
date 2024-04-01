/**
 * @fileoverview 近傍点検索を試すためのスクリプト
 */
/* eslint-disable no-undef */

import { initMap, loadJson, getRandomRgb } from '../leaflet_util.js'

let nearestPointLayer = null
let bufferNearPointsLayer = null
let bufferedLineLayer = null

const reset = () => {
  nearestPointLayer?.remove()
  bufferNearPointsLayer?.remove()
  bufferedLineLayer?.remove()
}

const listeners = {
  drawNearestPoint: async (map, points, line) => {
    nearestPointLayer?.remove()
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
    const { result } = await response.json()
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
  drawBufferNearPoints: async (map, points, line) => {
    bufferNearPointsLayer?.remove()
    bufferedLineLayer?.remove()
    const distance = 0.001 // TODO: メートルで指定したい。
    const response = await fetch('/brest/gis/buffernearpoints/', {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        points,
        line,
        distance
      })
    })
    const { result, bufferedLine } = await response.json()
    const circleMarkerStyle = {
      radius: 10,
      fillColor: 'green',
      color: 'black',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }
    bufferNearPointsLayer = L.geoJSON(result, {
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, circleMarkerStyle)
      }
    }).addTo(map)    
    bufferedLineLayer = L.geoJSON(bufferedLine).addTo(map)
  },
  reset
}

const addListener = (map, points, line) => {
  document.querySelector('main').addEventListener('click', async event => {
    const { eventName } = event.target.dataset
    if (typeof listeners[eventName] === 'function') {
      await listeners[eventName](map, points, line)
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

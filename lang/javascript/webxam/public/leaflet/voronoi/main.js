/**
 * @fileoverview ボロノイ図の描画を試すためのスクリプト
 */
/* eslint-disable no-undef */

import { initMap, loadJson } from '../leaflet_util.js'

let voronoiDiagramLayer = null

const reset = () => {
  if (voronoiDiagramLayer) {
    voronoiDiagramLayer.remove()
  }
}

const listeners = {
  drawVoronoiDiagram: async (map, points) => {
    reset()
    const response = await fetch('/brest/gis/voronoidiagram/', {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(points)
    })
    const { result } = await response.json()
    voronoiDiagramLayer = L.geoJSON(result).addTo(map)
  },
  reset
}

const addListener = (map, points) => {
  document.querySelector('main').addEventListener('click', async event => {
    const { eventName } = event.target.dataset
    if (typeof listeners[eventName] === 'function') {
      await listeners[eventName](map, points)
    }
  })
}

const main = async () => {
  const map = initMap({
    lat: 35.65414863273223, lng: 139.74060058593753, zoom: 14
  })
  const points = await loadJson('points.json')
  const markerStyle = {
    radius: 10,
    fillColor: 'blue',
    color: 'black',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }
  L.geoJSON([points], {
    pointToLayer: (feature, latlng) => {
      return L.circleMarker(latlng, markerStyle)
    }
  }).addTo(map)

  addListener(map, points)
}

main().then()

/**
 * @fileoverview 最小包含円の描画を試すためのスクリプト
 */
/* eslint-disable no-undef */

import { initMap, loadJson } from '../leaflet_util.js'

let minimumBoundingCircle = null

const reset = () => {
  if (minimumBoundingCircle) {
    minimumBoundingCircle.remove()
  }
}

const listeners = {
  drawMinimumBoundingCircle: async (map, geometry) => {
    reset()
    const response = await fetch('/brest/gis/minimumboundingcircle/', {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(geometry)
    })
    const { result } = await response.json()
    minimumBoundingCircle = L.geoJSON(result, {
      style: () => {
        return {
          color: 'black',
          fillColor: 'rgba(255,0,0,0.7)'
        }
      }
    })
    minimumBoundingCircle.addTo(map)
    const bounds = minimumBoundingCircle.getBounds()
    map.fitBounds(bounds)
  },
  reset
}

const addListener = (map, geometry) => {
  document.querySelector('main').addEventListener('click', async event => {
    const { eventName } = event.target.dataset
    if (typeof listeners[eventName] === 'function') {
      await listeners[eventName](map, geometry)
    } 
  })
}

const drawPoints = (map, geometry) => {
  L.geoJSON([geometry]).addTo(map)  
}

const main = async () => {
  const map = initMap()
  const geometry = await loadJson('points.json')
  drawPoints(map, geometry)
  addListener(map, geometry)
}

main().then()

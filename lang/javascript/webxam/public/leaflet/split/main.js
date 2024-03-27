/**
 * @fileoverview 図形の分割を試すためのスクリプト
 */
/* eslint-disable no-undef */

import { initMap, loadJson } from '../leaflet_util.js'

let splitPolygonLayer = null

const reset = () => {
  if (splitPolygonLayer) {
    splitPolygonLayer.remove()
  }
}

const getRandomRgb = (alpha = 1.0) => {
  return `rgba(${Math.random() * 255},
          ${Math.random() * 255},
          ${Math.random() * 255},
          ${alpha})`
}

const listeners = {
  splitPolygon: async (map, polygon, line) => {
    reset()
    const response = await fetch('/brest/gis/splitpolygon/', {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        polygon,
        line
      })
    })
    let { result } = await response.json()
    // GeometryCollectionで描画すると個々の図形のスタイル変更やイベントリスナー設定が難しくなる。
    if (result.type === 'GeometryCollection') {
      result = result.geometries
    }
    splitPolygonLayer = L.geoJSON(result, {
      style: () => {
        return {
          color: 'black',
          fillColor: getRandomRgb(),
          weight: 1
        }
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
    lat: 35.65523659647477, lng: 139.75589990615848, zoom: 16
  })
  const polygon = await loadJson('polygon.json')
  L.geoJSON([polygon]).addTo(map)
  const line = await loadJson('line.json')
  L.geoJSON([line]).addTo(map)


  addListener(map, polygon, line)
}

main().then()

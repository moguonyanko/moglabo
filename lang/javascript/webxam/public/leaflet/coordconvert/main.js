/**
 * @fileoverview 座標変換を練習するためのスクリプト
 */
/* eslint-disable no-undef */

import { initMap, loadJson } from '../leaflet_util.js'

let resultPointLayer = null

const reset = () => {
  resultPointLayer?.remove()
}

const listeners = {
  convert: async (map, point) => {
    resultPointLayer?.remove()
    const fromepsg = document.getElementById('fromCrs').value
    const toepsg = document.getElementById('toCrs').value
    const response = await fetch('/brest/gis/coordconvert/', {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        point,
        fromepsg,
        toepsg
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
    resultPointLayer = L.geoJSON(result, {
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, circleMarkerStyle)
      }
    }).addTo(map)
  },
  reset
}

const addListener = (map, point) => {
  document.querySelector('main').addEventListener('click', async event => {
    const { eventName } = event.target.dataset
    if (typeof listeners[eventName] === 'function') {
      await listeners[eventName](map, point)
    }
  })
}

const main = async () => {
  const map = initMap({
    lat: 35.65331637680658, lng: 139.75853919982913, zoom: 15
  })
  const point = await loadJson('point.json')
  L.geoJSON([point], {
    pointToLayer: (feature, latlng) => {
      return L.circleMarker(latlng, {
        radius: 10,
        fillColor: 'blue',
        color: 'black',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      })
    }
  }).addTo(map)

  addListener(map, point)
}

main().then()

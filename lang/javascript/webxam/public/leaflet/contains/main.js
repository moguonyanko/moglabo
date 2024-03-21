/**
 * @fileoverview 内外判定を試すためのスクリプト
 */
/* eslint-disable no-undef */

import { initMap, loadJson } from '../leaflet_util.js'

let emphasizePointsLayer = null

const reset = () => {
  if (emphasizePointsLayer) {
    emphasizePointsLayer.remove()
  }
}

const listeners = {
  emphasizeContainsPoints: async (map, polygon, points) => {
    reset()
    const response = await fetch('/brest/gis/contains/', {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        area_geojson: polygon,
        target_geojson: points
      })
    })
    const { result } = await response.json()
    const resultPoints = result[0]
    const emphasisMarkerStyle = {
      radius: 16,
      fillColor: 'red',
      color: 'black',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }
    emphasizePointsLayer = L.geoJSON(resultPoints, {
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, emphasisMarkerStyle)
      }
      // style: () => {
      //   return {
      //     color: 'black',
      //     fillColor: 'rgba(255,0,0,0.7)'
      //   }
      // }
    }).addTo(map)
  },
  reset
}

const addListener = (map, polygon, points) => {
  document.querySelector('main').addEventListener('click', async event => {
    const { eventName } = event.target.dataset
    if (typeof listeners[eventName] === 'function') {
      await listeners[eventName](map, polygon, points)
    }
  })
}

const main = async () => {
  const map = initMap({
    lat: 35.652969988398745, lng: 139.7564792633057
  })
  const polygon = await loadJson('polygon.json')
  L.geoJSON([polygon]).addTo(map)
  const points = await loadJson('points.json')
  const markerStyle = {
    radius: 16,
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

  addListener(map, polygon, points)
}

main().then()

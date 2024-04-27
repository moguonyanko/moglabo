/**
 * @fileoverview 経路探索を練習するためのスクリプト
 */
/* eslint-disable no-undef */

import { initMap, loadJson } from '../leaflet_util.js'
import { h, Component, render } from 'https://esm.sh/preact';
    
let startGoalLayerGroup = null
let resultRouteSearchLayer = null

const reset = () => {
  resultRouteSearchLayer?.remove()
}

const listeners = {
  executeRouteSearch: async (map, start, goal) => {
    resultRouteSearchLayer?.remove()
    const [startP, goalP] = startGoalLayerGroup.getLayers().map(layer => layer.getLatLng())
    const bounds = L.latLngBounds(startP, goalP)
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

const addSamplePreactHeader = () => {
  const app = h('p', null, 'OSMnxで経路探索します。');
  render(app, document.querySelector('main'));  
}

const main = async () => {
  addSamplePreactHeader()

  const map = initMap({
    lat: 35.45562693113854, lng: 139.63408470153811, zoom: 14
  })
  const start = await loadJson('start.json')
  const goal = await loadJson('goal.json')
  startGoalLayerGroup = L.geoJSON([start, goal], {
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
  })
  startGoalLayerGroup.addTo(map)

  addListener(map, start, goal)
}

main().then()

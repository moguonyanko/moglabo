/**
 * @fileoverview クラスタリングを試すためのスクリプト
 */
/* eslint-disable no-undef */

import { initMap, loadJson } from '../leaflet_util.js'

let map, clusteringTargetPoints, clusteringPolygonLayer

const reset = () => {
  if (clusteringPolygonLayer) {
    clusteringPolygonLayer.remove()
  }
}

const listeners = {
  onReset: () => {
    reset()
  },
  onExecuteClustering: async () => {
    reset()
    const clusterCount = document.getElementById('cluster-count').value

    const response = await fetch('/brest/gis/cluster/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        geojson: clusteringTargetPoints, 
        k: Number(clusterCount) 
      })
    })

    const geojsonData = await response.json()

    // GeoJSONレイヤーを作成して地図に追加
    clusteringPolygonLayer = L.geoJSON(geojsonData, {
      style: function (feature) {
        return { color: "blue", weight: 2, fillOpacity: 0.1 };
      },
      onEachFeature: function (feature, layer) {
        // ポップアップに情報を表示
        layer.bindPopup(
          `担当者: ${feature.properties.worker_id}<br>` +
          `拠点数: ${feature.properties.point_count}`
        );
      }
    }).addTo(map)
  },
  reset
}

const addListener = (map, points) => {
  document.querySelector('main').addEventListener('click', async event => {
    const { eventName } = event.target.dataset
    if (typeof listeners[eventName] === 'function') {
      try {
        event.target.setAttribute('disabled', 'disabled')
        await listeners[eventName](map, points)
      } finally {
        event.target.removeAttribute('disabled')
      }
    }
  })
}

const main = async () => {
  map = initMap({
    lat: 35.652969988398745, lng: 139.7564792633057
  })
  clusteringTargetPoints = await loadJson('points.json')
  const markerStyle = {
    radius: 16,
    fillColor: 'blue',
    color: 'black',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }

  L.geoJSON([clusteringTargetPoints], {
    pointToLayer: (feature, latlng) => {
      return L.circleMarker(latlng, markerStyle)
    }
  }).addTo(map)

  addListener()
}

main().then()

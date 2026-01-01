/**
 * @fileoverview クラスタリングを試すためのスクリプト
 */
/* eslint-disable no-undef */

import { initMap, loadJson } from '../leaflet_util.js'

let map, clusteringTargetPoints, clusteringPolygonLayer, labelLayerGroup

const reset = () => {
  if (clusteringPolygonLayer) {
    clusteringPolygonLayer.remove()
    labelLayerGroup.clearLayers()
  }
}

// あらかじめ視認性の良い色のリストを用意（担当者が増えてもループするようにする）
const clusterColors = ["#E63946", "#457B9D", "#1D3557", "#06D6A0",
  "#F4A261", "#8338EC", "#FF006E"]


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

    clusteringPolygonLayer = L.geoJSON(geojsonData, {
      style: feature => {
        // worker_id に応じて色を選択（IDが色の数を超えても大丈夫なように余りを利用）
        const colorIndex = (feature.properties.worker_id - 1) % clusterColors.length
        return {
          color: clusterColors[colorIndex], // 枠線の色
          fillColor: clusterColors[colorIndex], // 塗りつぶしの色
          weight: 3,
          fillOpacity: 0.3, // 塗りつぶしの濃さ
          dashArray: '3' // 境界線を点線にすると「目安」感が出て、重なりも見やすくなります
        }
      },
      onEachFeature: (feature, layer) => {
        // 1. ポップアップの設定
        layer.bindPopup(`<strong>担当者 ${feature.properties.worker_id}</strong><br>` +
          `巡回拠点数: ${feature.properties.point_count}件`)

        // 2. 重心にラベル（担当者番号）を表示
        // getBounds().getCenter() でポリゴンの中心座標を取得
        const center = layer.getBounds().getCenter()

        const label = L.marker(center, {
          icon: L.divIcon({
            className: 'worker-label', // CSSでスタイルを指定するためのクラス名
            html: `<div>${feature.properties.worker_id}</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15] // 中心に配置
          }),
          interactive: false // ラベル自体はクリック不可にする（下のポリゴンを邪魔しない）
        })
        label.addTo(labelLayerGroup)

        // マウス操作で強調する
        layer.on('mouseover', e => {
          e.target.setStyle({ fillOpacity: 0.6 })
        })

        layer.on('mouseout', e => {
          e.target.setStyle({ fillOpacity: 0.3 })
        })
      }
    }).addTo(map)
  }
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

  labelLayerGroup = L.layerGroup().addTo(map)

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

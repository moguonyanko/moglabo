/**
 * @fileoverview クラスタリングを試すためのスクリプト
 */
/* eslint-disable no-undef */

import { initMap, loadJson } from '../leaflet_util.js'

let map,
  clusteringTargetPoints,
  clusteringPolygonLayer,
  labelLayerGroup,
  selectedLayer

const reset = () => {
  if (clusteringPolygonLayer) {
    clusteringPolygonLayer.remove()
    labelLayerGroup.clearLayers()
  }
}

// あらかじめ視認性の良い色のリストを用意（担当者が増えてもループするようにする）
const clusterColors = ["#E63946", "#457B9D", "#1D3557", "#06D6A0",
  "#F4A261", "#8338EC", "#FF006E"]


// 強調表示の関数
const highlightPolygon = target => {
  // すでに選択されているものがあれば元に戻す
  if (selectedLayer && selectedLayer !== target) {
    clusteringPolygonLayer.resetStyle(selectedLayer)
  }
  // 新しいターゲットを強調
  target.setStyle({ fillOpacity: 0.7, weight: 5 })
  selectedLayer = target;
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
        // ポップアップの設定
        layer.bindPopup(`<strong>担当者 ${feature.properties.worker_id}</strong><br>` +
          `巡回拠点数: ${feature.properties.point_count}件`)

        // デバイスを問わずクリックされたポリゴンを強調する
        layer.on('click', e => {
          highlightPolygon(e.target)
          L.DomEvent.stopPropagation(e) // 地図へのクリックイベント伝搬を止める
        })

        // 重心にラベル（担当者番号）を表示
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

// 高度(m)を受け取って色(Hex)を返す関数
const getAltitudeColor = alt => {
  return alt > 100 ? '#78350f' : // 100m以上: 濃い茶
    alt > 50 ? '#92400e' : // 50m以上: 茶
      alt > 20 ? '#d97706' : // 20m以上: オレンジ
        alt > 10 ? '#f59e0b' : // 10m以上: 黄
          alt > 5 ? '#10b981' : // 5m以上: 緑
            '#3b82f6';   // それ以下: 青
}

const addLegend = () => {
  // 凡例コントロールの作成
  const legend = L.control({ position: 'bottomright' })

  legend.onAdd = map => {
    const div = L.DomUtil.create('div', 'info legend')
    const grades = [0, 5, 10, 20, 50, 100]

    // タイトル部分
    div.innerHTML = '<div style="margin-bottom: 8px;"><strong>高度 (m)</strong></div>'

    // 各項目をループで生成
    for (let i = 0; i < grades.length; i++) {
      const from = grades[i]
      const to = grades[i + 1]
      const color = getAltitudeColor(from + 1)

      // 新しい行要素を作成
      const item = L.DomUtil.create('div', 'legend-item', div)
      item.innerHTML = `
              <span style="background:${color}"></span>
              ${from}${to ? '&ndash;' + to + 'm' : 'm +'}
          `
    }

    return div
  }

  legend.addTo(map)
}

const main = async () => {
  map = initMap({
    lat: 35.652969988398745, lng: 139.7564792633057
  })

  labelLayerGroup = L.layerGroup().addTo(map)

  clusteringTargetPoints = await loadJson('points.json')

  L.geoJSON([clusteringTargetPoints], {
    pointToLayer: (feature, latlng) => {
      const alt = feature.properties.altitude || (feature.geometry.coordinates[2] ?? 0)
      const color = getAltitudeColor(alt)
      const markerStyle = {
        radius: 8,
        fillColor: color,
        color: '#ffffff',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }

      return L.circleMarker(latlng, markerStyle)
    },
    onEachFeature: (feature, layer) => {
      const lat = feature.geometry.coordinates[1]
      const lng = feature.geometry.coordinates[0]
      const alt = feature.properties.altitude || (feature.geometry.coordinates[2] ?? 0)

      // ポップアップの内容を構築
      const popupContent = `
        <div class="poi-popup">
          <div class="poi-title">地点情報</div>
          
          <div class="poi-row">
            <span class="poi-label">緯度</span>
            <span class="poi-value">${lat.toFixed(6)}</span>
          </div>
          
          <div class="poi-row">
            <span class="poi-label">経度</span>
            <span class="poi-value">${lng.toFixed(6)}</span>
          </div>
          
          <div class="poi-row">
            <span class="poi-label">高度</span>
            <span class="poi-value" style="color: ${getAltitudeColor(alt)}; font-weight: bold;">
              ${alt.toFixed(1)}m
            </span>
          </div>
        </div>
      `

      layer.bindPopup(popupContent)
    }
  }).addTo(map)


  addLegend()

  addListener()
}

main().then()

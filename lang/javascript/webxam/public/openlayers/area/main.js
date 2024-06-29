/**
 * @fileoverview OpenLayers上にあるポリゴンの面積を計算するサンプル
 */
/* eslint-disable no-undef */

import { initMap } from '../openlayerscommon.js'

const getPolygonLayer = async () => {
  const response = await fetch('polygon.json')
  const geojson = await response.json()

  const source = new OpenLayers.source.Vector({
    features: [new OpenLayers.Feature(geojson)]
  })

  const style = new OpenLayers.style.Style({
    stroke: new OpenLayers.style.Stroke({
      color: '#ff0000',
      width: 3
    }),
    fill: new OpenLayers.style.Fill({
      color: '#ff0000',
      alpha: 0.5
    })
  })  

  const layer = new OpenLayers.layer.Vector({
    source,
    style
  })
  
  return layer
}

const init = async () => {
  const map = initMap()
  // TODO: 最新のOpenLayersでポリゴンを描画する。
  // const polygonLayer = await getPolygonLayer()
  // map.addlayer(polygonLayer)
}

init().then()

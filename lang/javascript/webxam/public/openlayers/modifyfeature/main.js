/**
 * @fileoverview 地物の修正を試すためのスクリプト
 * 参考:
 * https://openlayers.org/en/latest/examples/modify-features.html
 */
/* eslint-disable no-undef */

import { initMap } from '../openlayerscommon.js'

const { Select, Modify, Draw, Snap } = ol.interaction
const { defaults } = ol.interaction.defaults
const VectorLayer = ol.layer.Vector
const VectorSource = ol.source.Vector
const { GeoJSON } = ol.format

const geoJson = new GeoJSON()

const source = new VectorSource({
  url: 'sample_polygons.json',
  format: new GeoJSON(),
  wrapX: false
})

const vector = new VectorLayer({
  background: 'transparent',
  source
})

const select = new Select({
  wrapX: false
})
/**
 * 参考:
 * https://openlayers.org/en/latest/apidoc/module-ol_geom_Polygon-Polygon.html#intersectsCoordinate
 */
const modify = new Modify({
  features: select.getFeatures()
})

//図形をフリーハンドで描ける。
// const draw = new Draw({
//   source,
//   type: 'Polygon',
// })

// modify.removePoint()を呼び出すだけでundoできるので古い地物を保存しておく必要はない。
// let oldFeature
// modify.on('modifystart', event => {
//   oldFeature = event.features.item(0).clone()
// })

modify.on('modifyend', async event => {
  const newFeature = event.features.pop()
  // writeFeaturesの戻り値は文字列なのでJSON.stringifyは必要ない。
  const body = geoJson.writeFeatures([newFeature])
  const response = await fetch('/brest/gis/crosscheck/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body
  })
  if (!response.ok) {
    throw new Error(`交差判定失敗:${response.status}`)
  }
  const { result } = await response.json()
  if (result) {
    alert('ポリゴンが自己交差しています！')
    // 一点前に戻る。
    modify.removePoint()
  }
})

// 点や線分に入力中の点を「吸着」させることができる。
const snap = new Snap({
  source
})

const map = initMap({
  interactions: defaults().extend([select, modify, snap]),
  layers: [vector],
  zoom: 17
})

/**
 * @fileoverview 地物の修正を試すためのスクリプト
 * 参考:
 * https://openlayers.org/en/latest/examples/modify-features.html
 */
/* eslint-disable no-undef */

import { initMap } from '../openlayerscommon.js'

const { Select, Modify, Draw } = ol.interaction
const { defaults } = ol.interaction.defaults
const VectorLayer = ol.layer.Vector
const VectorSource = ol.source.Vector
const { GeoJSON } = ol.format

const gj = new GeoJSON()

const vector = new VectorLayer({
  background: 'transparent',
  source: new VectorSource({
    url: 'sample.json',
    format: new GeoJSON(),
    wrapX: false
  })
})

const select = new Select({
  wrapX: false
})
/**
 * TODO: ポリゴンが交差していたらエラーになるようにしたい。
 * 参考:
 * https://openlayers.org/en/latest/apidoc/module-ol_geom_Polygon-Polygon.html#intersectsCoordinate
 */
const modify = new Modify({
  features: select.getFeatures()
})

modify.on('modifyend', async event => {
  const polygon = event.features.pop()
  // writeFeaturesの戻り値は文字列なのでJSON.stringifyは必要ない。
  const geojsonFeature = gj.writeFeatures([polygon])
  const response = await fetch('/brest/gis/crosscheck/', {
    method: 'POST',
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
    },
    body: geojsonFeature
  })
  if (!response.ok) {
    throw new Error(`交差判定失敗:${response.status}`)
  }
  const { result } = await response.json()
  if (result) {
    alert('ポリゴンが自己交差しています！')
    // TOOD: 編集前のポリゴンに戻す処理
  }
})

// const drawInterraction = new Draw({
//   type: 'Polygon'
// })

// drawInterraction.on('drawend', event => {
//   console.log(event)
// })

const map = initMap({
  interactions: defaults().extend([select, modify]),
  layers: [vector],
  zoom: 17
})
//map.addInteraction(drawInterraction)

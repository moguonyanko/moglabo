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

const geoJson = new GeoJSON()

const source = new VectorSource({
  url: 'sample_donutpolygon.json',
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
 * TODO: ポリゴンが交差していたらエラーになるようにしたい。
 * 参考:
 * https://openlayers.org/en/latest/apidoc/module-ol_geom_Polygon-Polygon.html#intersectsCoordinate
 */
const modify = new Modify({
  features: select.getFeatures()
})

// const draw = new Draw({
//   source,
//   type: 'Polygon',
// })

let map, preFeature

modify.on('modifystart', event => {
  preFeature = event.features.item(0).clone()
})

modify.on('modifyend', async event => {
  const newFeature = event.features.pop()
  // writeFeaturesの戻り値は文字列なのでJSON.stringifyは必要ない。
  const body = geoJson.writeFeatures([newFeature])
  const response = await fetch('/brest/gis/crosscheck/', {
    method: 'POST',
    mode: 'cors',
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
    // TOOD: 編集前のポリゴンに戻す処理
    source.removeFeature(newFeature)
    source.addFeature(preFeature)
    // TODO: 図形を非選択状態に戻したい。
    //map.removeInteraction(modify)
    //map.addInteraction(modify)
    select.setActive(false)
  }
})

map = initMap({
  interactions: defaults().extend([select, modify]),
  layers: [vector],
  zoom: 17
})

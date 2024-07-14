/**
 * @fileoverview 地物の修正を試すためのスクリプト
 * 参考:
 * https://openlayers.org/en/latest/examples/modify-features.html
 */
/* eslint-disable no-undef */

import { initMap } from '../openlayerscommon.js'

const { Select, Modify } = ol.interaction
const { defaults } = ol.interaction.defaults
const VectorLayer = ol.layer.Vector
const VectorSource = ol.source.Vector
const { GeoJSON } = ol.format

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
  features: select.getFeatures(),
  insertVertexCondition: () => {
    console.log(select)
  }
})

const map = initMap({
  interactions: defaults().extend([select, modify]),
  layers: [vector],
  zoom: 17
})

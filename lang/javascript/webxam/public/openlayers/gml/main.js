/**
 * @fileoverview 地物の修正を試すためのスクリプト
 * 参考:
 * https://openlayers.org/en/latest/examples/modify-features.html
 */
/* eslint-disable no-undef */

import { initMap } from '../openlayerscommon.js'

const VectorLayer = ol.layer.Vector
const VectorSource = ol.source.Vector
const { Style, Stroke, Fill } = ol.style
const { GeoJSON, GML } = ol.format

const vector = new VectorLayer({
  source: new VectorSource({
    url: '../sample/14100_youto.gml',
    format: new GML({
      srsName: 'EPSG:4326' // TODO: 何も表示されない。
    })
  }),
  style: new Style({
    stroke: new Stroke({
      color: '#ff0000',
      width: 2
    }),
    fill: new Fill({
      color: '#ff0000',
      opacity: 0.5
    })
  })
})

const map = initMap({
  layers: [vector],
  zoom: 17
})

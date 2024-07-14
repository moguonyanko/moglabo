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
const { GML } = ol.format

const { register } = ol.proj.proj4
const getProjection = ol.proj.get
const { Projection } = ol.proj

const GML_CODE = 'EPSG:6697'

const registerProjection = () => {
  proj4.defs(GML_CODE, '+proj=longlat +ellps=GRS80 +vunits=m +no_defs +type=crs')
  register(proj4)  
}

const getGMLProjection = () => {
  registerProjection()
  return getProjection(GML_CODE)
}

const projection = new Projection({
  code: GML_CODE,
  extent: [129.3, 30.94, 145.87,45.54]
})

console.log(getGMLProjection(), projection)

const vector = new VectorLayer({
  source: new VectorSource({
    url: '../sample/14100_youto.gml',
    format: new GML()
  }),
  style: new Style({
    stroke: new Stroke({
      color: '#ff0000',
      width: 2
    }),
    fill: new Fill({
      color: '#ff0000',
      opacity: 0.8
    })
  })
})

const map = initMap({
  layers: [vector],
  zoom: 13,
  projection: getGMLProjection()
})

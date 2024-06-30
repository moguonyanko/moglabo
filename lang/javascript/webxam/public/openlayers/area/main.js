/**
 * @fileoverview OpenLayers上にあるポリゴンの面積を計算するサンプル
 * 参考:
 * https://openlayers.org/en/latest/examples/polygon-styles.html
 */
/* eslint-disable no-undef */

import { initMap } from '../openlayerscommon.js'

const { GeoJSON } = ol.format
const { MultiPoint } = ol.geom
const VectorLayer = ol.layer.Vector
const VectorSource = ol.source.Vector
const { Circle, Fill, Stroke, Style } = ol.style

const styles = [
  /* We are using two different styles for the polygons:
   *  - The first style is for the polygons themselves.
   *  - The second style is to draw the vertices of the polygons.
   *    In a custom `geometry` function the vertices of a polygon are
   *    returned as `MultiPoint` geometry, which will be used to render
   *    the style.
   */
  new Style({
    stroke: new Stroke({
      color: 'blue',
      width: 3,
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.1)',
    }),
  }),
  new Style({
    image: new Circle({
      radius: 4,
      fill: new Fill({
        color: 'red',
      }),
    }),
    geometry: feature => {
      // return the coordinates of the first ring of the polygon
      const coordinates = feature.getGeometry().getCoordinates()[0]
      return new MultiPoint(coordinates)
    },
  }),
]

const getPolygonLayer = async () => {
  const response = await fetch('polygon.json')
  const geojson = await response.json()

  const source = new VectorSource({
    features: new GeoJSON().readFeatures(geojson),
  })

  const layer = new VectorLayer({
    source,
    style: styles,
  })

  return layer
}

const init = async () => {
  const map = initMap()
  const polygonLayer = await getPolygonLayer()
  map.addLayer(polygonLayer)
}

init().then()

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

const POLYGON_ID = 'sample-polygon-layer-1'

const getPolygonLayer = () => {
  const source = new VectorSource({
    url: 'polygon.json',
    format: new GeoJSON()
  })

  const layer = new VectorLayer({
    source,
    style: styles
  })

  return layer
}

// DOM

const funcs = {
  calcArea: async layer => {
    const features = layer.getSource().getFeatures()
    const polygon = features[0].getGeometry()
    // GeometryのみをGeoJSONに書き出すならwriteGeometryを使う。
    //const geojsonPolygon = new GeoJSON().writeFeatures(features)
    const geojsonPolygon = new GeoJSON().writeGeometry(polygon)
    console.log(geojsonPolygon)

    const respone = await fetch('https://localhost/falcon/api/calcarea', {
      method: 'POST',
      headers: {
        'Content-Type': 'application.json'
      },
      body: geojsonPolygon
    })
    const { area } = await respone.json()

    const output = document.querySelector(`div[data-event-output='calcArea']`)
    output.textContent = area
  }
}

const init = () => {
  const map = initMap()
  const polygonLayer = getPolygonLayer()
  map.addLayer(polygonLayer)

  document.querySelector('main').addEventListener('click', async event => {
    const { eventFunction } = event.target.dataset
    await funcs[eventFunction]?.(polygonLayer)
  })
}

init()

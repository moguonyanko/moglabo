/**
 * @fileoverview OpenLayers上にあるポリゴンの面積を計算するサンプル
 * 参考:
 * https://openlayers.org/en/latest/examples/polygon-styles.html
 * https://openlayers.org/en/latest/examples/measure.html
 */
/* eslint-disable no-undef */

import { initMap } from '../openlayerscommon.js'

const { GeoJSON } = ol.format
const { MultiPoint } = ol.geom
const VectorLayer = ol.layer.Vector
const VectorSource = ol.source.Vector
const { Circle, Fill, Stroke, Style } = ol.style
const TransformExtent = ol.proj.transformExtent
const { getArea } = ol.sphere

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

/**
 * 参考:
 * https://stackoverflow.com/questions/36134974/transforming-coordinates-of-feature-in-openlayers
 */
const getGeometry = layer => {
  const features = layer.getSource().getFeatures()
  // 緯度経度の座標を保持するポリゴンから平方メートルの面積を得るための座標変換
  // 元のPolygonを残したい場合はcloneしておく必要がある。
  const geom = features[0].getGeometry().clone()
  const polygon = geom.transform('EPSG:4326', 'EPSG:3857')
  return polygon
}

const getPolygonGeoJson = layer => {
  const polygon = getGeometry(layer)
  // GeometryのみをGeoJSONに書き出すならwriteGeometryを使う。
  //const geojsonPolygon = new GeoJSON().writeFeatures(features)
  const geojsonPolygon = new GeoJSON().writeGeometry(polygon)
  return geojsonPolygon
}

// DOM

const printResult = result => {
  const output = document.querySelector(`div[data-event-output='calcArea']`)
  output.innerHTML += `${result}<br />`
}

const funcs = {
  calcAreaByShapely: async layer => {
    const geojsonPolygon = getPolygonGeoJson(layer)
    console.log(geojsonPolygon)

    const respone = await fetch('https://localhost/falcon/api/calcarea', {
      method: 'POST',
      headers: {
        'Content-Type': 'application.json'
      },
      body: geojsonPolygon
    })
    const { area } = await respone.json()
    printResult(area)
  },
  calcAreaByOpenLayers: layer => {
    const polygon = getGeometry(layer)
    const area = getArea(polygon)
    printResult(area)
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

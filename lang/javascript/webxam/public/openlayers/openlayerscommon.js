/**
 * @fileoverview OpenLayersの共通処理をまとめたスクリプト
 */
/* eslint-disable no-undef */

const { Map, View } = ol
const { OSM } = ol.source
const { Tile } = ol.layer

const initMap = ({ target = 'map',
  lon = 139.64006991057147, lat = 35.44343730412503,
  zoom = 16 } = {}) => {
  const map = new Map({
    target,
    layers: [
      new Tile({
        source: new OSM(),
      }),
    ],
    view: new View({
      projection: 'EPSG:4326',
      center: [lon, lat],
      zoom,
    }),
  })

  return map
}

export {
  initMap
}

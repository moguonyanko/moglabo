/**
 * @fileoverview OpenLayersの共通処理をまとめたスクリプト
 */
/* eslint-disable no-undef */

const { Map, View } = ol
const { OSM } = ol.source
const { Tile } = ol.layer

const initMap = ({ target = 'map',
  lon = 139.63408470153811, lat = 35.45562693113854,
  zoom = 15 } = {}) => {
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

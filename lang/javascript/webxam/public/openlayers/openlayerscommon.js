/**
 * @fileoverview OpenLayersの共通処理をまとめたスクリプト
 */
/* eslint-disable no-undef */

const { Map, View } = ol
const { OSM, TileDebug } = ol.source
const TileLayer = ol.layer.Tile

const initMap = ({ target = 'map',
  lon = 139.64006991057147, lat = 35.44343730412503,
  zoom = 16, debug = false, projection = 'EPSG:4326' } = {}) => {
  const layers = [
    new TileLayer({
      source: new OSM()
    })
  ]
  if (debug) {
    layers.push(new TileLayer({
      source: new TileDebug()
    }))
  }
  const map = new Map({
    target,
    layers,
    view: new View({
      projection,
      center: [lon, lat],
      zoom,
    }),
  })

  return map
}

export {
  initMap
}

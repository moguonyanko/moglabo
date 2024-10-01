/**
 * @fileoverview OpenLayersの共通処理をまとめたスクリプト
 */
/* eslint-disable no-undef */

const { Map, View } = ol
const { OSM, TileDebug } = ol.source
const TileLayer = ol.layer.Tile
const { defaults } = ol.interaction.defaults

const initMap = ({ target = 'map',
  lon = 139.64006991057147, lat = 35.44343730412503,
  zoom = 16, debug = false, projection = 'EPSG:3857', 
  interactions = defaults(),
  layers = [] } = {}) => {
  const requestLayers = [
    new TileLayer({
      source: new OSM()
    })
  ].concat(layers)
  if (debug) {
    requestLayers.push(new TileLayer({
      source: new TileDebug()
    }))
  }
  const map = new Map({
    interactions,
    target,
    layers: requestLayers,
    view: new View({
      projection,
      center: ol.proj.fromLonLat([lon, lat], projection),
      zoom,
    }),
  })

  return map
}

export {
  initMap
}

/**
 * @fileoverview ラスター地図の再投影を試みるスクリプトです。
 * 参考:
 * https://openlayers.org/doc/tutorials/raster-reprojection.html
 */
/* eslint-disable no-undef */

const { Map, View } = ol
const { OSM, TileDebug, TileWMS } = ol.source
const TileLayer = ol.layer.Tile
const { defaults } = ol.interaction.defaults
const { fromLonLat } = ol.proj

const lon = 139.64006991057147, lat = 35.44343730412503

const srcProj = 'EPSG:4326'
const rasterLayer = new TileLayer({
  source: new TileWMS({
    projection: srcProj,
    url: 'https://ahocevar.com/geoserver/wms',
    params: {
      'LAYERS': 'ne:NE1_HR_LC_SR_W_DR'
    }
  })
})

const distProj = 'EPSG:3857'
const view = new View({
  projection: distProj, 
  center: fromLonLat([lon, lat], distProj),
  zoom: 7,
})

const map = new Map({
  target: 'map',
  view,
  layers: [rasterLayer]
})

console.log(map)

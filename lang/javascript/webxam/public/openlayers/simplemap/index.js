/**
 * @fileoverviewv OpenStreetMapのシンプルな地図を表示するサンプル
 * 参考:
 * https://wiki.openstreetmap.org/wiki/OpenLayers_Simple_Example
 */
/* eslint-disable no-undef */

const init = () => {
  const map = new OpenLayers.Map("demoMap")
  const mapnik = new OpenLayers.Layer.OSM()
  // Transform from WGS 1984
  const fromProjection = new OpenLayers.Projection("EPSG:4326") 
  // to Spherical Mercator Projection  
  const toProjection = new OpenLayers.Projection("EPSG:900913") 
  const position = new OpenLayers.LonLat(139.63408470153811, 35.45562693113854)
    .transform(fromProjection, toProjection)
  const zoom = 15

  map.addLayer(mapnik)
  map.setCenter(position, zoom)
  // map.zoomToMaxExtent()
}

window.addEventListener('load', init)

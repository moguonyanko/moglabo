/**
 * @fileoverviewv OpenStreetMapのシンプルな地図を表示するサンプル
 */

const init = () => {
  const map = new OpenLayers.Map("demoMap");
  map.addLayer(new OpenLayers.Layer.OSM());
  map.zoomToMaxExtent();
}

init();

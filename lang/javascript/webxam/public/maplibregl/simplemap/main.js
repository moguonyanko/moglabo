/**
 * @fileoverview シンプルな地図表示を行うサンプルスクリプトです。
 * 参考:
 * https://github.com/maplibre/maplibre-gl-js
 */
/* eslint-disable no-undef */

const init = () => {
  const lon = 139.64006991057147, lat = 35.44343730412503
  const map = new maplibregl.Map({
    container: 'map',
    style: 'https://demotiles.maplibre.org/style.json', // stylesheet location
    center: [lon, lat],
    zoom: 9 
  })
  console.log(map)
}

init()

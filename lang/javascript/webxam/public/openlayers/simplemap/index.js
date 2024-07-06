/**
 * @fileoverviewv OpenStreetMapのシンプルな地図を表示するサンプル
 * 参考:
 * https://wiki.openstreetmap.org/wiki/OpenLayers_Simple_Example
 * https://openlayers.org/en/latest/examples/canvas-tiles.html
 */
/* eslint-disable no-undef */

import { initMap } from '../openlayerscommon.js'

// debug=trueとすることでタイルのグリッド線を描画する。
const map = initMap({ debug: true })
console.log('Map initialized', map)

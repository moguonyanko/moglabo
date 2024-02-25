/**
 * @fileoverview WebMappingServiceをLeafletから利用するためのサンプルスクリプト
 * 参考:
 * https://leafletjs.com/examples/wms/wms.html
 */
/* eslint-disable no-undef */

const init = () => {
  const map = L.map('map', {
    center: [35.656159, 139.7552989],
    zoom: 15
  })

  const baseMaps = {
    Topography: L.tileLayer.wms('https://ows.mundialis.de/services/service?', {
      layers: 'TOPO-WMS'
    }),
    Places: L.tileLayer.wms('https://ows.mundialis.de/services/service?', {
      layers: 'OSM-Overlay-WMS'
    }),
    TopographyOSM: L.tileLayer.wms('https://ows.mundialis.de/services/service?', {
      layers: 'TOPO-OSM-WMS'
    }),
    'Topography, then places': L.tileLayer.wms('https://ows.mundialis.de/services/service?', {
      layers: 'TOPO-WMS,OSM-Overlay-WMS'
    }),
    'Places, then topography': L.tileLayer.wms('https://ows.mundialis.de/services/service?', {
      layers: 'OSM-Overlay-WMS,TOPO-WMS'
    })
  }

  L.control.layers(baseMaps).addTo(map);
  baseMaps.TopographyOSM.addTo(map);

  // TMSを利用する場合
  // Leafletの原点は左上隅だがTMSは左下隅なのでyにマイナスを付けて符号を逆にする必要がある。
  // const tmsLayer = L.tileLayer('http://base_url/tms/1.0.0/tileset/{z}/{x}/{-y}.png').addTo(map)
  // console.log(tmsLayer)
}

init()

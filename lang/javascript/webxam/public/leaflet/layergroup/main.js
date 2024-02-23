/**
 * @fileoverview レイヤグループの動作確認をするためのスクリプト
 * 参考:
 * https://leafletjs.com/examples/layers-control/
 */
/* eslint-disable no-undef */

const init = () => {
  const hamamatuchoStation = L.marker([35.6554915,139.7564151]).bindPopup('浜松町駅'),
    daimonStation = L.marker([35.6569807,139.7545657]).bindPopup('大門駅'),
    takeshibaStation = L.marker([35.6537655,139.7613385]).bindPopup('竹芝駅')

  const stations = L.layerGroup([hamamatuchoStation, daimonStation, takeshibaStation])

  const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  })

  const osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
  })

  const map = L.map('map', {
    center: [35.656159, 139.7552989],
    zoom: 15,
    zoomDelta: 0.5,
    // 拡大縮小操作時にスナップされる縮尺の量を設定する。 https://leafletjs.com/examples/zoom-levels/
    zoomSnap: 0,  
    layers: [osm, stations]
  })

  const baseMaps = {
    'OpenStreetMap': osm,
    '<span class="special">OpenStreetMap.HOT</span>': osmHOT
  }

  const overlayMaps = {
    "駅": stations
  }

  const layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

  const conbiniA = L.marker([35.6579622,139.7541492]).bindPopup("コンビニA"),
    conbiniB = L.marker([35.6541648,139.7547073]).bindPopup("コンビニB")

  const conbinis = L.layerGroup([conbiniA, conbiniB])

  const openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)'
  })

  // 後からbasemapやoverlayを追加することもできる。
  // TODO: この方法で追加したものを初期表示で表示状態にできるのか？
  layerControl.addBaseLayer(openTopoMap, "OpenTopoMap");
  layerControl.addOverlay(conbinis, "コンビニ");
}

init()

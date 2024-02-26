/**
 * @fileoverview ペインを試すためのサンプルスクリプト
 * 参考:
 * https://leafletjs.com/examples/map-panes/
 */
/* eslint-disable no-undef */

const init = async () => {
  const map = L.map('map')

  const customPane = map.createPane('mapLabels')
  console.log(customPane) // customPaneはただのdiv要素

  // 以下はイベントリスナーを意図通りに動作させるためのコードだがこれがなくても本サンプルは正常に動作する。
  // イベントを受け取るレイヤをより上段に設置した方がよいのではないか？
  //customPane.style.zIndex = 650
  // カスタムペインにイベントの発生を阻害されないようにPointerイベントを無効化する。
  //customPane.style.pointerEvents = 'none'

	const cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>'
  
	const chikeiLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
		attribution: cartodbAttribution
	}).addTo(map)
  console.log(chikeiLayer)

	const chimeiLabelLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
		attribution: cartodbAttribution,
		pane: 'mapLabels'
	}).addTo(map);
  console.log(chimeiLabelLayer)

  const JapanGeoJson = await (await fetch('../data/japan.json')).json()
	const geojson = L.geoJson(JapanGeoJson).addTo(map)

	geojson.eachLayer(layer => {
		layer.bindPopup(layer.feature.properties.name);
	})

  map.setView({lat: 35.656159, lng: 139.7552989}, 8);
}

init().then()

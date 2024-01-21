/**
 * @fileoverview LeafletでOpenStreetMapの地図を表示するためのサンプルスクリト
 * 参考:
 * https://leafletjs.com/examples/quick-start/example.html
 */
/* eslint-disable no-undef */

const init = () => {
	const [lat, lon] = [35.6815657, 139.7675949]
	const zoom = 14
	const map = L.map('map').setView([lat, lon], zoom)

	const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map)
	console.log(tiles)

	const marker = L.marker([lat, lon])
		.addTo(map).bindPopup('<strong>𩸽を𠮟る𠮷野家</strong>').openPopup()
	console.log(marker)

	const [circleLat, circleLon] = [35.6856189, 139.7525002]
	const circle = L.circle([circleLat, circleLon], {
		color: 'red',
		fillColor: '#f03',
		fillOpacity: 0.2,
		radius: 1000
	}).addTo(map).bindPopup(`円の中心は経度${circleLat},緯度${circleLon}`)
	console.log(circle)

	const polygon = L.polygon([
		[35.6813576, 139.7784939],
		[35.6822327, 139.7859957],
		[35.6697208, 139.7708326],
		[35.6731245, 139.7583829]
	]).addTo(map).bindPopup('サンプルポリゴン')
	console.log(polygon)

	const popup = L.popup()
		.setLatLng([35.6885528, 139.7658447])
		.setContent('サンプルポップアップ').openOn(map);
	console.log(popup)

	const onMapClick = evt => {
		console.log(evt)
		const { lat, lng } = evt.latlng
		popup.setLatLng(evt.latlng)
			.setContent(`緯度=${lat}<br />経度=${lng}`)
			.openOn(map)
	}

	map.on('click', onMapClick);
}

init()

/**
 * @fileoverview 線分と点の位置関係を調べるスクリプト
 */
/* eslint-disable no-undef */

const main = async () => {
  const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  })

  const getJson = async path => await (await fetch(path)).json()
  const line = await getJson('line.json')
  const rightPoint = await getJson('rightpoint.json')
  const leftPoint = await getJson('leftpoint.json')

  const map = L.map('map', {
    renderer: L.canvas(),
    layers: [osm]
  })

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: async () => {
        if (feature.geometry.type !== 'Point') {
          return
        }
        // TODO: 検証のためクロスオリジンにしたい。
        const response = await fetch('/brest/gis/pointsideofline/', {
          method: 'POST',
          mode: 'cors',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            point: feature,
            line
          })
        })
        const result = await response.json()
        // openPopup()を呼ばないと初回のクリックではポップアップが表示されない。
        if (result.side > 0) {
          layer.bindPopup('シンボルはラインの右側にあります').openPopup()  
        } else if (result.side < 0) {
          layer.bindPopup('シンボルはラインの左側にあります').openPopup()   
        } else {
          layer.bindPopup('シンボルはライン上にあります').openPopup()   
        }
      }
    })
  }

  L.geoJSON([line, rightPoint, leftPoint], {
    onEachFeature
  }).addTo(map)

  map.setView({ lat: 35.657871, lng: 139.755138 }, 15)
}

main().then()

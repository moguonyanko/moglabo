/**
 * @fileoverview 線分交差判定用スクリプト
 */

const main = async () => {
  const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  })

  const loadGeoJson = async path => await (await fetch(path)).json()
  const targetLine = await loadGeoJson('targetline.json')
  const checkLine1 = await loadGeoJson('checkline1.json')
  const checkLine2 = await loadGeoJson('checkline2.json')

  const map = L.map('map', {
    renderer: L.canvas(),
    layers: [osm]
  })

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: async () => {
        const response = await fetch('/brest/gis/linecrosscheck/', {
          method: 'POST',
          mode: 'cors',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            line1: targetLine,
            line2: feature
          })
        })
        const { result } = await response.json()
        if (result) {
          layer.bindPopup('ラインは交差しています').openPopup()  
        } else {
          layer.bindPopup('ラインは交差していません').openPopup()  
        }
      }
    })
  }

  const targetLineLayer = L.geoJSON([targetLine], {
    style: feature => {
      return {
        color: 'red',
        weight: 15
      }
    },
    onEachFeature
  })
  // setStyleで後からスタイル設定することもできる。
  // targetLineLayer.setStyle({
  //   color: 'red'
  // })
  targetLineLayer.addTo(map)

  L.geoJSON([checkLine1, checkLine2], {
    style: feature => {
      return {
        weight: 10
      }
    },
    onEachFeature
  }).addTo(map)

  map.setView({ lat: 35.656763324153324, lng: 139.75555658340457 }, 17)

  const viewClickLatLng = evt => {
    const { lat, lng } = evt.latlng
    const info = `lat: ${lat}, lng: ${lng}`
    console.log(info)
    //L.popup().setLatLng(evt.latlng).setContent(info).openOn(map)
  }

  map.on('click', viewClickLatLng)  
}

main().then()

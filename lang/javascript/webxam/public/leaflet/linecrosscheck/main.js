/**
 * @fileoverview 線分交差判定用スクリプト
 */

const main = async () => {
  const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  })

  const getJson = async path => await (await fetch(path)).json()
  const targetLine = await getJson('targetline.json')
  const checkLine1 = await getJson('checkline1.json')
  const checkLine2 = await getJson('checkline2.json')

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
        if (result > 0) {
          layer.bindPopup('ラインは交差しています').openPopup()  
        } else if (result < 0) {
          layer.bindPopup('ラインは交差していません').openPopup()  
        } else {
          layer.bindPopup('ラインは重なっています').openPopup()  
        }
      }
    })
  }

  L.geoJSON([targetLine, checkLine1, checkLine2], {
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

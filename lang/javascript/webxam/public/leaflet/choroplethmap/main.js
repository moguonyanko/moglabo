/**
 * @fileoverview 地図の色分けを行うスクリプト
 * 参考:
 * https://leafletjs.com/examples/choropleth/
 */
/* eslint-disable no-undef */

import LeafletCommons from "../leaflet_common.js"

const viewJapanChoroplethMap = async map => {
  const geojson = await (await fetch('../data/japan.json')).json()

  const getColor = pref => {
    let color = '#FF0000'
    if (pref % 3 === 0) {
      color = '#00FF00'
    } else if (pref % 2 === 0) {
      color = '#0000FF'
    }
    return color
  }

  const style = feature => {
    return {
      fillColor: getColor(feature.properties.pref),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    }
  }

  L.geoJson(geojson, { style }).addTo(map);
}

const viewChikakoujiMap = async map => {
  const geojson = await (await fetch('../data/chikakouji.json')).json()

  const getColor = koujiKakaku => {
    return koujiKakaku > 1000000 ? '#800026' :
           koujiKakaku > 900000  ? '#BD0026' :
           koujiKakaku > 800000  ? '#E31A1C' :
           koujiKakaku > 700000  ? '#FC4E2A' :
           koujiKakaku > 600000  ? '#FD8D3C' :
           koujiKakaku > 500000  ? '#FEB24C' :
           koujiKakaku > 400000  ? '#FED976' :
                                   '#FFEDA0'
  }

  const style = feature => {
    const koujiKakaku = 'L01_006'
    return {
      fillColor: getColor(feature.properties[koujiKakaku]),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    }
  }

  L.geoJson(geojson, { style }).addTo(map);
}

const createPropertyInfo = () => {
  const info = L.control()

  info.onAdd = function () {
    this._div = L.DomUtil.create('div', 'info')
    this.update()
    return this._div
  }

  info.update = function (props) {
    this._div.innerHTML = '<div class="title">人口集中地区</div>' + (props ?
      '<span>人口:</span>' + props['人口'] + '人' : '地区を選択してください')
  }

  return info
}

const jinkouGrades = [10000, 25000, 50000, 100000, 200000, 500000, 1000000]

const getJinkouColor = jinkou => {
  return jinkou > jinkouGrades[6] ? '#800026' :
         jinkou > jinkouGrades[5] ? '#BD0026' :
         jinkou > jinkouGrades[4] ? '#E31A1C' :
         jinkou > jinkouGrades[3] ? '#FC4E2A' :
         jinkou > jinkouGrades[2] ? '#FD8D3C' :
         jinkou > jinkouGrades[1] ? '#FEB24C' :
         jinkou > jinkouGrades[0] ? '#FED976' :
                              '#FFEDA0'
}

const createLegend = () => {
  const legend = L.control({ position: 'bottomright' })

  legend.onAdd = () => {
    const div = L.DomUtil.create('div', 'info legend')

    const fragment = document.createDocumentFragment()
    for (let i = 0; i < jinkouGrades.length; i++) {
      const legendItem = document.createElement('span')
      legendItem.classList.add('legenditem')
      legendItem.style.backgroundColor = getJinkouColor(jinkouGrades[i] + 1)
      const legendValue = jinkouGrades[i] + (jinkouGrades[i + 1] ? '&ndash;' + 
        jinkouGrades[i + 1] + '<br />' : '+')
      legendItem.innerHTML += legendValue
      fragment.appendChild(legendItem)
    }

    div.appendChild(fragment)

    return div
  }

  return legend
}

const viewJinkouShuchuChikuMap = async map => {
  const srcFeatures = await (await fetch('../data/jinkoushuchuchiku.json')).json()

  const defaultStyle = {
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  }

  const style = feature => {
    const jinkou = '人口'
    const styleObj = {
      fillColor: getJinkouColor(feature.properties[jinkou])
    }
    Object.assign(styleObj, defaultStyle)
    return styleObj
  }

  const info = createPropertyInfo()
  info.addTo(map)
  const legend = createLegend()
  legend.addTo(map)

  const highlightFeature = event => {
    const layer = event.target;
  
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
  
    layer.bringToFront();
    info.update(layer.feature.properties)
  }

  const resetHighlight = event => {
    const layer = event.target
    layer.setStyle(defaultStyle)
    layer.bringToBack()
   //geojson.resetStyle(event.target) // 上と同じ
    info.update()
  }

  const zoomToFeature = event => {
    const feature = event.target.feature
    map.fitBounds(event.target.getBounds());
    // クリック時に市町村名をポップアップに表示する。    
    const popupContent = feature.properties['市町村名称']
    event.target.bindPopup(popupContent)
  }

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    });
  }

  const geojson = L.geoJson(srcFeatures, { 
    style, 
    onEachFeature
  }).addTo(map)

  return geojson
}

const init = async () => {
  const lc = new LeafletCommons({ 
    maxZoom: 18, 
    zoom: 10,
    lat: 35.36606942124,
    lng: 139.42261961841
  })
  const { map } = lc.initMap()

  const geojson = await viewJinkouShuchuChikuMap(map)
  //const geojson = await viewChikakoujiMap(map)
  console.log(geojson)
}

init().then()

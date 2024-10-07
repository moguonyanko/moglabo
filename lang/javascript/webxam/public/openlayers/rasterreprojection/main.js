/**
 * @fileoverview WMSから得たラスター地図の再投影を試みるスクリプトです。
 * ベクタータイル地図を重ね合わせています。
 * 参考:
 * https://openlayers.org/doc/tutorials/raster-reprojection.html
 * https://openlayers.org/en/latest/examples/canvas-tiles-tms.html
 */
/* eslint-disable no-undef */

const { MVT } = ol.format
const { Map, View } = ol
const { TileWMS, VectorTile } = ol.source
const TileLayer = ol.layer.Tile
const VectorTileLayer = ol.layer.VectorTile
const { fromLonLat } = ol.proj
const { Text, Stroke, Fill, Style } = ol.style

const lon = 139.64006991057147, lat = 35.44343730412503

const srcProj = 'EPSG:4326'

const wmsLayer = new TileLayer({
  source: new TileWMS({
    projection: srcProj,
    url: 'https://ahocevar.com/geoserver/wms',
    params: {
      'LAYERS': 'ne:NE1_HR_LC_SR_W_DR'
    }
  })
})

// TODO: 国土地理院の地図を表示するには手続きが必要かもしれない。
// https://maps.gsi.go.jp/development/ichiran.html
// const xyzLayer = new TileLayer({
//   source: new ImageTile({
//     url: 'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png'
//   })
// })

const vectorTileLayerStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.6)'
  }),
  stroke: new Stroke({
    color: '#319FD3',
    width: 1
  }),
  text: new Text({
    font: '12px Calibri,sans-serif',
    fill: new Fill({
      color: '#000'
    }),
    stroke: new Stroke({
      color: '#fff',
      width: 3
    })
  })
})

const vectorTileLayer = new VectorTileLayer({
  declutter: true,
  source: new VectorTile({
    maxZoom: 7,
    format: new MVT(), // Mapboxのフォーマット
    url: 'https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/' +
      'ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf'
  }),
  style: feature => {
    const featureName = feature.get('name')
    // console.log(`地物名:${featureName}`)
    vectorTileLayerStyle.getText().setText(featureName)
    return vectorTileLayerStyle
  }
})

const distProj = 'EPSG:3857'
const view = new View({
  projection: distProj, 
  center: fromLonLat([lon, lat], distProj),
  zoom: 7
})

const map = new Map({
  target: 'map',
  view,
  layers: [wmsLayer, vectorTileLayer]
})

console.log(map)

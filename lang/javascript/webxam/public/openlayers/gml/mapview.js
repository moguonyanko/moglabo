/**
 * @fileoverview GMLファイルから読み込んだ地物をを地図に重ねるサンプル
 */

/* eslint-disable no-undef */

// 緯度経度（EPSG:4326）による初期表示位置
const initialLonLat = [139.64006991057147, 35.44343730412503]

// BaseMap（OpenStreetMap）の表示

const BASE_MAP_EPSG = 'EPSG:3857'

const map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    // Viewにprojectionを指定しなければEPSG:3857で地図表示が行われる。
    // したがって他のEPSGで表現された座標は以下のように変換が必要となる。
    center: ol.proj.fromLonLat(initialLonLat, BASE_MAP_EPSG),
    zoom: 13
  })
})

// GMLファイルに定義された地物表示

const source = new ol.source.Vector({
  loader: async (extent, resolution, projection) => {
    console.log('Arguments:', extent, resolution, projection)
    const url = '../sample/14100_youto.gml'
    const response = await fetch(url)
    const gmlText = await response.text()
    const formatGml = new ol.format.GML({
      featureNS: 'http://www.opengis.net/citygml/2.0',
      featureType: 'urf:UrbanPlanningArea',
      // GML内の地物の座標を表現するのに使われているEPSG
      srsName: 'EPSG:6697' 
    })
    // TODO: 読み込んだ地物の結果が空になってしまう。ゆえにExtentも不正な値になり例外が発生する。
    const features = formatGml.readFeatures(gmlText, {
      featureProjection: BASE_MAP_EPSG
    })
    console.log('Features:', features)
    source.addFeatures(features)
  }
})

const gmlLayer = new ol.layer.Vector({
  source
})

map.addLayer(gmlLayer)

// VectorSourceに地物追加などの変更が行われたタイミングで地図表示領域を設定する。
source.once('change', () => {
  const extent = source.getExtent()
  console.log('Extent:', extent)
  map.getView().fit(extent, { duration: 1000 })
})

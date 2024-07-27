/**
 * @fileoverview 地物の修正を試すためのスクリプト
 * 参考:
 * https://openlayers.org/en/latest/examples/modify-features.html
 */
/* eslint-disable no-undef */

import { initMap } from '../openlayerscommon.js'

const { Select, Modify, Draw, Snap } = ol.interaction
const { defaults } = ol.interaction.defaults
const VectorLayer = ol.layer.Vector
const VectorSource = ol.source.Vector
const { GeoJSON } = ol.format

const geoJson = new GeoJSON()

const source = new VectorSource({
  url: 'sample_polygons.json',
  format: new GeoJSON(),
  wrapX: false
})

const vector = new VectorLayer({
  background: 'transparent',
  source
})

const select = new Select({
  wrapX: false
})
/**
 * 参考:
 * https://openlayers.org/en/latest/apidoc/module-ol_geom_Polygon-Polygon.html#intersectsCoordinate
 */
const modify = new Modify({
  features: select.getFeatures()
})

//図形をフリーハンドで描ける。
// const draw = new Draw({
//   source,
//   type: 'Polygon',
// })

// modify.removePoint()を呼び出すだけでundoできるので古い地物を保存しておく必要はない。
// let oldFeature
// modify.on('modifystart', event => {
//   oldFeature = event.features.item(0).clone()
// })

// エラーが発生した際、その場でalertなどによるエラーハンドリングを行うのではなく
// CustomEventを使って伝播させていくことでエラーハンドリングが柔軟に行えるようにする。
const createModifyErrorEvent = detail => {
  return new CustomEvent('modifyerror', { detail })
}

let mapElement

modify.on('modifyend', async event => {
  // features.pop()でも期待通りに動作しているが予期せぬ副作用による影響を
  // 避けるためitem(0)で取得しclone()している。
  const newFeature = event.features.item(0).clone()
  // writeFeaturesの戻り値は文字列なのでJSON.stringifyは必要ない。
  const body = geoJson.writeFeatures([newFeature])
  const response = await fetch('/brest/gis/crosscheck/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body
  })
  let modifyErrorEvent
  if (response.ok) {
    const { result } = await response.json()
    if (result) {
      modifyErrorEvent = createModifyErrorEvent('ポリゴンが自己交差しています！')
    }  
  } else {
    modifyErrorEvent = createModifyErrorEvent(`交差判定失敗:${response.status}`)
  }
  if (modifyErrorEvent) {
    // 問題発生時は一点前に戻る。modifyerrorのイベントリスナー側でやってもいいが
    // イベントリスナーを自由に設定できるようにするなら必須処理はこちらに書くべきである。
    modify.removePoint()
    mapElement.dispatchEvent(modifyErrorEvent)
  }
})

// 点や線分に入力中の点を「吸着」させることができる。
const snap = new Snap({
  source
})

const map = initMap({
  interactions: defaults().extend([select, modify, snap]),
  layers: [vector],
  zoom: 17
})
mapElement = map.getTargetElement()

mapElement.addEventListener('modifyerror', event => {
  alert(event.detail)
})

/**
 * @fileoverview グリッドレイヤーを動作確認するためのスクリプト
 */
/* eslint-disable no-undef */

const init = () => {
  class CanvasCircles extends L.GridLayer {
    createTile(coords) {
      const tile = document.createElement('canvas')

      const tileSize = this.getTileSize()
      tile.setAttribute('width', tileSize.x)
      tile.setAttribute('height', tileSize.y)

      const ctx = tile.getContext('2d')

      ctx.fillStyle = 'red'
      ctx.arc(tileSize.x / 2, tileSize.x / 2, 4 + coords.z * 4, 0, 2 * Math.PI, false)
      ctx.fill()

      // createTileがdoneを引数に取っていなければタイルを返すだけでタイルは表示される。
      return tile
    }
  }

  class MyGridLayer extends L.GridLayer {
    createTile(coords, done) {
      // TileLayerと違いimg要素以外でもタイルにすることができる。
      const tile = document.createElement('div')
      tile.classList.add('tile')
      tile.textContent = `X=${coords.x}, Y=${coords.y}, Z=${coords.z}`

      // タイルが徐々に表示されるような見た目になる。
      // done()を呼び出さないとタイルが表示されない。
      setTimeout(() => done(null, tile),
        500 + Math.random() * 1500)

      return tile
    }
  }

  class HelloWatermark extends L.Control {
    constructor(options) {
      super(options)
    }

    onAdd(map) {
      const img = L.DomUtil.create('img')
      img.src = '../../image/hello.png'
      img.style.height = '3em'
      img.style.width = '10em'
      return img
    }

    onRemove(map) {
      console.log('Removed watermark')
    }
  }

  const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  })

  const myGridLayer = new MyGridLayer(),
    myCanvasLayer = new CanvasCircles()

  const baseMaps = {
    'OpenStreetMap': osm,
    'MyGridLayer': myGridLayer,
    'MyCanvasLayer': myCanvasLayer
  }

  const map = L.map('map', {
    renderer: L.canvas(),
    layers: [osm] // ここに追加したレイヤが初期表示される。
  })

  const layerControl = L.control.layers(baseMaps).addTo(map)
  console.log(layerControl)

  // map.addLayer(myGridLayer)
  // map.addLayer(myCanvasLayer)
  map.setView({ lat: 35.656159, lng: 139.7552989 }, 8)

  const watermarkCtrl = new HelloWatermark({ position: 'bottomleft' }).addTo(map)
  console.log(watermarkCtrl)
}

init()

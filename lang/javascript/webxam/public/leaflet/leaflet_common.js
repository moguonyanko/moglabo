/**
 * @fileoverview Leafletのサンプル作成における共通の処理をまとめたスクリプト
 */
/* eslint-disable no-undef */

class LeafletCommons {
  #zoom
  #maxZoom
  #lat
  #lng

  constructor({ zoom = 14, maxZoom = 19, lat = 35.6815657, lng = 139.7675949 }) {
    this.#zoom = zoom
    this.#maxZoom = maxZoom
    this.#lat = lat
    this.#lng = lng
  }

  initMap() {
    const map = L.map('map').setView([this.#lat, this.#lng], this.#zoom)
  
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: this.#maxZoom,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map)
    console.log(tiles)   
    
    return { map, tiles }
  }
}

export default LeafletCommons

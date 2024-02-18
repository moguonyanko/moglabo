/**
 * @fileoverview カスタマイズされたアイコンを試すためのスクリプト
 * 参考:
 * https://leafletjs.com/examples/custom-icons/
 */
/* eslint-disable no-undef */

const iconTypes = {
  green: {
    path: "leaf-green.png"
  },
  red: {
    path: "leaf-red.png"
  },
  orange: {
    path: "leaf-orange.png"
  }
}

const getIcon = iconType => {
  return L.icon({
    iconUrl: iconType.path,
    shadowUrl: 'leaf-shadow.png',
    iconSize: [38, 95], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
  })
}

// 普通に継承してカスタマイズすることはできなさそう。
// class MyIcon extends L.Icon {
//   #message = ''

//   constructor({ iconUrl, message = '' }) {
//     super({ iconUrl })
//     this.#message = message
//     this.options = {
//       shadowUrl: 'leaf-shadow.png',
//       iconSize: [38, 95],
//       shadowSize: [50, 64],
//       iconAnchor: [22, 94],
//       shadowAnchor: [4, 62],
//       popupAnchor: [-3, -76]
//     }
//   }

//   get message() {
//     return this.#message
//   }
// }

const MyIcon = L.Icon.extend({
  options: {
    shadowUrl: 'leaf-shadow.png',
    iconSize: [70, 95],
    shadowSize: [50, 64],
    iconAnchor: [22, 94],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76]
  },
  initialize(options) {
    L.Util.setOptions(this, options)
    this.message = options.message
  }
})

const init = () => {
  const [lat, lng] = [35.6815657, 139.7675949]
  const zoom = 14
  const map = L.map('map').setView([lat, lng], zoom)

  const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map)
  console.log(tiles)

  const greenIcon = getIcon(iconTypes.green),
    redIcon = getIcon(iconTypes.red),
    orangeIcon = getIcon(iconTypes.orange)

  const customIcon = new MyIcon({ iconUrl: 'customicon.png', message: 'カスタムアイコン' })

  L.marker([lat, lng], { icon: greenIcon }).addTo(map)
    .bindPopup('緑のはっぱ');
  L.marker([lat, lng - 0.01], { icon: redIcon }).addTo(map)
    .bindPopup('赤のはっぱ');
  L.marker([lat, lng + 0.01], { icon: orangeIcon }).addTo(map)
    .bindPopup('橙のはっぱ');

  L.marker([lat + 0.005, lng - 0.005], { icon: customIcon }).addTo(map)
    .bindPopup(customIcon.message);
}

init()

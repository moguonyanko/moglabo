/**
 * @fileoverview 3Dの地物表示を試すためのスクリプトです。
 * 参考:
 * https://maplibre.org/maplibre-gl-js/docs/examples/3d-extrusion-floorplan/
 */
/* eslint-disable no-undef */

// Yokohama
const lon = 139.64006991057147, lat = 35.44343730412503

const map = new maplibregl.Map({
  container: 'map',
  style: {
      'id': 'raster',
      'version': 8,
      'name': 'Raster tiles',
      'center': [0, 0],
      'zoom': 0,
      'sources': {
          'raster-tiles': {
              'type': 'raster',
              'tiles': ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              'tileSize': 256,
              'minzoom': 0,
              'maxzoom': 19
          }
      },
      'layers': [
          {
              'id': 'background',
              'type': 'background',
              'paint': {
                  'background-color': '#e0dfdf'
              }
          },
          {
              'id': 'simple-tiles',
              'type': 'raster',
              'source': 'raster-tiles'
          }
      ]
  },
 center: [-87.61694, 41.86625],
//   center: [lon, lat],
  zoom: 15.99,
  pitch: 40,
  bearing: 20,
  antialias: true
})

map.on('load', () => {
  map.addSource('floorplan', {
      // GeoJSON Data source used in vector tiles, documented at
      // https://gist.github.com/ryanbaumann/a7d970386ce59d11c16278b90dde094d
      'type': 'geojson',
      'data': 'https://maplibre.org/maplibre-gl-js/docs/assets/indoor-3d-map.geojson'
  })
  // addlayerをしないと地物が表示されない。
  map.addLayer({
      'id': 'room-extrusion',
      'type': 'fill-extrusion',
      'source': 'floorplan',
      'paint': {
          // See the MapLibre Style Specification for details on data expressions.
          // https://maplibre.org/maplibre-style-spec/expressions/

          // Get the fill-extrusion-color from the source 'color' property.
          'fill-extrusion-color': ['get', 'color'],

          // Get fill-extrusion-height from the source 'height' property.
          'fill-extrusion-height': ['get', 'height'],

          // Get fill-extrusion-base from the source 'base_height' property.
          'fill-extrusion-base': ['get', 'base_height'],

          // Make extrusions slightly opaque for see through indoor walls.
          'fill-extrusion-opacity': 0.5
      }
  })
})
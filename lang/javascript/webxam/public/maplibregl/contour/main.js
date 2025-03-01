/**
 * @fileoverview 等高線を描画するサンプルスクリプト
 * 参考:
 * https://maplibre.org/maplibre-gl-js/docs/examples/contour-lines/
 */
/* eslint-disable no-undef */

const demSource = new mlcontour.DemSource({
  url: 'https://demotiles.maplibre.org/terrain-tiles/{z}/{x}/{y}.png',
  encoding: 'mapbox',
  maxzoom: 12,
  // offload contour line computation to a web worker
  worker: true
});

// calls maplibregl.addProtocol to register a dynamic vector tile provider that
// downloads raster-dem tiles, computes contour lines, and encodes as a vector
// tile for each tile request from maplibre
demSource.setupMaplibre(maplibregl);

const lon = 139.64006991057147, lat = 35.44343730412503

const map = (window.map = new maplibregl.Map({
  container: 'map',
  zoom: 13,
  // center: [lon, lat],
  center: [11.3229, 47.2738],
  hash: true,
  style: {
      version: 8,
      glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
      sources: {
          hillshadeSource: {
              type: 'raster-dem',
              // share cached raster-dem tiles with the contour source
              tiles: [demSource.sharedDemProtocolUrl],
              tileSize: 512,
              maxzoom: 12
          },
          contourSourceFeet: {
              type: 'vector',
              tiles: [
                  demSource.contourProtocolUrl({
                  // meters to feet
                      multiplier: 3.28084,
                      overzoom: 1,
                      thresholds: {
                      // zoom: [minor, major]
                          11: [200, 1000],
                          12: [100, 500],
                          13: [100, 500],
                          14: [50, 200],
                          15: [20, 100]
                      },
                      elevationKey: 'ele',
                      levelKey: 'level',
                      contourLayer: 'contours'
                  })
              ],
              maxzoom: 15
          }
      },
      layers: [
          {
              id: 'hills',
              type: 'hillshade',
              source: 'hillshadeSource',
              layout: {visibility: 'visible'},
              paint: {'hillshade-exaggeration': 0.25}
          },
          {
              id: 'contours',
              type: 'line',
              source: 'contourSourceFeet',
              'source-layer': 'contours',
              paint: {
                  'line-opacity': 0.5,
                  // "major" contours have level=1, "minor" have level=0
                  'line-width': ['match', ['get', 'level'], 1, 1, 0.5]
              }
          },
          {
              id: 'contour-text',
              type: 'symbol',
              source: 'contourSourceFeet',
              'source-layer': 'contours',
              filter: ['>', ['get', 'level'], 0],
              paint: {
                  'text-halo-color': 'white',
                  'text-halo-width': 1
              },
              layout: {
                  'symbol-placement': 'line',
                  'text-size': 10,
                  'text-field': [
                      'concat',
                      ['number-format', ['get', 'ele'], {}],
                      '\''
                  ],
                  'text-font': ['Noto Sans Bold']
              }
          }
      ]
  }
}));
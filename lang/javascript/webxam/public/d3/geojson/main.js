/**
 * @fileoverview GeoJSONとD3調査用スクリプト
 * 参考:
 * https://bl.ocks.org/d3indepth/c62b6ce6625b69f6007cea5fccdd4599
 * https://d3-wiki.readthedocs.io/zh_CN/master/Geo-Paths/
 */

// TODO: 投影法を外部から指定できるようにする
const getProjection = ({ param }) => {
  return d3.geo.equirectangular()
    .scale(param.scale)
    .translate(param.translate);
};

const getGeoGenerator = ({ context, param }) => {
  const proj = getProjection({ param });
  return d3.geo.path()
    .projection(proj)
    .context(context);
};

const defaultDrawStyle = {
  lineWidth: 1.0,
  fillStyle: '#ffcc00',
  strokeStyle: '#ff1493'
};

const drawGeoJson = ({ context, geojson, param,
  style = defaultDrawStyle }) => {
  Object.assign(context, style);

  context.beginPath();
  const generate = getGeoGenerator({ context, param });
  generate({
    type: 'FeatureCollection',
    features: geojson.features
  });
  context.fill();
  context.stroke();
};

const loadGeoJson = async path => {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Cannot load GeoJSON: ${res.status}`);
  }
  return await res.json();
};

// DOM

const examples = {
  drawGeoJsonToCanvas: async () => {
    const geojson = await loadGeoJson('./samplegeojson1.json');
    const canvas = document.querySelector('canvas.mapcontainer');
    const context = canvas.getContext('2d');
    const param = {
      scale: 200,
      translate: [200, 150]
    };
    drawGeoJson({ context, geojson, param });
  },
  drawGeoJsonToSVG: async () => {
    const geojson = await loadGeoJson('./samplegeojson1.json');
    const param = {
      scale: 200,
      translate: [200, 150]
    };
    const generator = getGeoGenerator({ param });

    const map = d3.select('svg.mapcontainer .svgmap')
      .selectAll('path')
      .data(geojson.features);

    map.enter().append('path').attr('d', generator);
  }
};

Object.values(examples).map(async f => await f());

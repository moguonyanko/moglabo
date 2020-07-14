/**
 * @fileoverview GeoJSONとD3調査用スクリプト
 * 参考:
 * https://bl.ocks.org/d3indepth/c62b6ce6625b69f6007cea5fccdd4599
 * https://d3-wiki.readthedocs.io/zh_CN/master/Geo-Paths/
 */

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

const drawGeoJson = ({ context, geojson, param, style = {} }) => {
  context.lineWidth = style.lineWidth ?? 1.5;
  context.strokeStyle = style.strokeStyle ?? '#ff1493';

  context.beginPath();
  const generate = getGeoGenerator({ context, param });
  generate({
    type: 'FeatureCollection',
    features: geojson.features
  });
  context.stroke();
};

const examples = {
  drawGeoJson: async () => {
    const res = await fetch('./samplegeojson1.json');
    if (!res.ok) {
      throw new Error(`Cannot load GeoJSON: ${res.status}`);
    }
    const geojson = await res.json();
    const canvas = document.querySelector('canvas.geojson');
    const context = canvas.getContext('2d');
    const param = {
      scale: 200,
      translate: [200, 150]
    };
    drawGeoJson({ context, geojson, param });
  }
};

const main = () => {
  const promises = Object.values(examples).map(f => f());
  Promise.all(promises).then();
};

main();

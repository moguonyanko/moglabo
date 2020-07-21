/**
 * @fileoverview 投影法調査用スクリプト
 * 参考:
 * https://bl.ocks.org/d3indepth/8fe422f6d5f6999c931f942d93035aba
 */

class Projector {
  constructor({ type, scale, center = [0, 0],
    rotate = [0.1, 0, 0], translateFactor = 0.5 }) {
    Object.assign(this, { type, scale, center, rotate, translateFactor });
  }

  getProjection({ globalScale, width, height }) {
    return d3[`geo${this.type}`]()
      .scale(globalScale * this.scale)
      .center(this.center)
      .rotate(this.rotate)
      .translate([this.translateFactor * width,
      this.translateFactor * height]);
  }
}

const getGeoGenerator = ({ projection, context }) => {
  return d3.geoPath()
    .projection(projection)
    .context(context);
};

const loadJson = async path => {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Cannot load json: ${res.status}`);
  }
  const geojson = await res.json();
  return geojson;
};

const drawGraticule = ({ context, generator }) => {
  context.lineWidth = 0.3;
  context.strokeStyle = '#663399';
  context.setLineDash([1, 1]); // 経緯度の線は点線にする。
  context.beginPath();
  generator(d3.geoGraticule()());
  context.stroke();
};

// 投影法の違いによる面積や角度の違いを表すための円
const circleCoords = [
  [0, 0], [-90, 0], [-45, 0],
  [45, 0], [90, 0], [0, -70],
  [0, -35], [0, 35], [0, 70]
];

const drawCircle = ({ context, generator, radius = 10, precision = 1 }) => {
  const geoCircle = d3.geoCircle().radius(radius).precision(precision);
  context.setLineDash([]);
  context.lineWidth = 1.0;
  context.strokeStyle = 'rgb(204,0,0)';
  context.fillStyle = 'rgba(204,0,0,0.2)';
  circleCoords.forEach(center => {
    geoCircle.center(center);
    context.beginPath();
    generator(geoCircle());
    context.fill();
    context.stroke();
  });
};

const drawMap = ({ context, generator, geojson }) => {
  context.lineWidth = 0.5;
  context.fillStyle = '#3399CC';
  context.setLineDash([]);
  context.beginPath();
  generator({ type: 'FeatureCollection', ...geojson })
  context.fill();
  context.stroke();
};

// DOM

const appendProjections = ({list, projections}) => {
  const fragment = projections.map(p => {
    const opt = document.createElement('option');
    opt.appendChild(document.createTextNode(p.type));
    opt.value = JSON.stringify(p);
    return opt;
  }).reduce((acc, current) => {
    acc.appendChild(current);
    return acc;
  }, document.createDocumentFragment());

  list.appendChild(fragment);
};

const main = async () => {
  const list = document.getElementById('projectionlist');
  appendProjections({
    list,
    projections: await loadJson('projections.json')
  });

  const geojson = await loadJson('sample.json');

  const canvas = document.querySelector('canvas.map');
  const context = canvas.getContext('2d');
  const { width, height } = canvas;
  const globalScale = 1.0;

  list.addEventListener('change', event => {
    context.clearRect(0, 0, width, height);
    const param = JSON.parse(event.target.value);
    const pj = new Projector(param);
    const projection = pj.getProjection({
      width, height, globalScale
    });
    // 地図を収める範囲(BBOX)を指定できる。
    // ただし一部の投影法(ConicConformalなど)で正しく地図が表示されなくなる。
    //projection.fitExtent([[20, 20], [780, 580]], geojson);
    const generator = getGeoGenerator({ projection, context });

    drawGraticule({ context, generator });
    drawMap({ context, generator, geojson });
    drawCircle({ context, generator });
  })
};

main().then();

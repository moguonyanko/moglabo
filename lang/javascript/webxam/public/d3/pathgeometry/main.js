/**
 * @fileoverview D3.jsのgeoPathから幾何情報を得るサンプル
 * 参考:
 * https://bl.ocks.org/d3indepth/3ccd770923a61f26f55156657e2f51e8
 */

class MapView {
  #projection;
  #context;
  #features = [];

  #defaultStyle = {
    lineWidth: 1.0,
    strokeStyle: 'rgb(51, 0, 102)',
    fillStyle: 'rgba(0, 153, 102, 0.5)'
  };

  constructor({ projectionName, scale, translate, center, context }) {
    this.#projection = d3[`geo${projectionName}`]()
      .scale(scale)
      .translate(translate)
      .center(center);
    this.#context = context;
  }

  getGenerator({ pointRadius = 5, style,
    context = this.#context } = {}) {
    Object.assign(this.#context, style);

    const generator = d3.geoPath()
      .pointRadius(pointRadius)
      .projection(this.#projection)
      .context(context);

    return generator;
  }

  draw({ features, style = this.#defaultStyle }) {
    this.#features = features;
    this.#context.save();
    const generator = this.getGenerator({ style });
    // 各々の輪郭を描画できるように地物を1つずつ処理する。
    this.#features.forEach(feature => {
      this.#context.beginPath();
      generator(feature);
      this.#context.stroke();
      this.#context.fill();
      // closePathを呼び出す必要はない。
    });
    this.#context.restore();
  }

  getFeaturesFromPoint({ x, y }) {
    if (this.#features?.length <= 0) {
      return [];
    }
    const { width, height } = this.#context.canvas;
    const cvs = new OffscreenCanvas(width, height);
    const ctx = cvs.getContext('2d');
    const generator = this.getGenerator({ context: ctx });
    // 地物がヒットした時点で処理を終了したいところだが、重なっている複数地物のピック
    // 即ち串刺しもありえるので全ての地物をテストしている。
    const results = this.#features.filter(feature => {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctx.beginPath();
      generator(feature);
      ctx.stroke();
      return ctx.isPointInPath(x, y);
    });
    return results;
  }
}

const loadJson = async path => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`JSON loading error: ${response.status}`);
  }
  return await response.json();
};

const runTest = async () => {
  const canvas = new OffscreenCanvas(400, 400);
  const context = canvas.getContext('2d');
  const mv = new MapView({
    scale: 400,
    translate: [100, 200],
    center: [1, 1],
    projectionName: 'Mercator',
    context
  });
  const { features } = await loadJson('./sample.json');
  mv.draw({ features });
};

runTest();

// DOM

let mapView;

const drawMap = ({ features, canvas }) => {
  mapView = new MapView({
    scale: 400,
    translate: [200, 280],
    center: [0, 5],
    projectionName: 'Mercator',
    context: canvas.getContext('2d')
  });
  mapView.draw({ features });
};

// 地物を強調するための矩形と点は元のサンプル同様SVGで描画している。
// 強調図形描画用のCanvasに差し替えてCanvasに描画する方が一貫性があるかもしれない。
// ただしCanvasだと毎回古い形状をクリアする処理が必要になる。
const drawAttentionRect = ({ bounds, centroid }) => {
  const [x, y] = [
    bounds[0][0], bounds[0][1]
  ];

  const [width, height] = [
    bounds[1][0] - x,
    bounds[1][1] - y
  ];

  d3.select('.bounding-box rect')
    .attr('x', x)
    .attr('y', y)
    .attr('width', width)
    .attr('height', height);

  d3.select('.centroid')
    .style('display', 'inline')
    .attr('transform', 'translate(' + centroid + ')');
};

function reportFeature() {
  const [x, y] = d3.mouse(this);
  const results = mapView.getFeaturesFromPoint({ x, y });
  if (results.length <= 0) {
    return;
  }
  const feature = results[0];
  const generator = mapView.getGenerator();
  const [area, centroid, bounds, measure] = [
    generator.area(feature),
    generator.centroid(feature),
    generator.bounds(feature),
    generator.measure(feature)
  ];
  console.log(area, centroid, bounds, measure);
  drawAttentionRect({ bounds, centroid });

  const info = document.querySelector('.infomation');
  info.textContent = `地域名:${feature.properties.name} 面積:${area.toFixed(1)} 周長:${measure.toFixed(1)}`;
};

const init = async () => {
  const canvas = document.querySelector('canvas.map');
  const geojson = await loadJson('./sample.json');
  drawMap({ ...geojson, canvas });
  const map = d3.select('.container');
  map.on('click', reportFeature);
};

init().then();

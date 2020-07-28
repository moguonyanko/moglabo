/**
 * @fileoverview D3.jsのgeoPathから幾何情報を得るサンプル
 * 参考:
 * https://bl.ocks.org/d3indepth/3ccd770923a61f26f55156657e2f51e8
 */

class MapView {
  #projection;
  #context;

  constructor({ projectionName, scale, translate, center, context }) {
    this.#projection = d3[`geo${projectionName}`]()
      .scale(scale)
      .translate(translate)
      .center(center);
    this.#context = context;
  }

  getGenerator({ pointRadius = 5, style } = {}) {
    Object.assign(this.#context, style);

    const generator = d3.geoPath()
      .pointRadius(pointRadius)
      .projection(this.#projection)
      .context(this.#context);

    return generator;
  }

  draw({ features, style = {
    lineWidth: 1.0,
    strokeStyle: '#CCCCCC',
    fillStyle: '#009966'
  } }) {
    this.#context.save();
    const generator = this.getGenerator({ style });
    // 各々の輪郭を描画できるように地物を1つずつ処理する。
    features.forEach(feature => {
      this.#context.beginPath();
      generator(feature);
      this.#context.stroke();
      this.#context.fill();
      // closePathを呼び出す必要はない。
    });
    this.#context.restore();
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

const reportFeature = feature => {
  // TODO: 常に1番目の地物が取得されてしまう。
  // クリックされた位置に該当する地物を取得したい。
  // 自前でFeatureとクリック位置のヒット判定を行うしかないだろうか？
  console.log(feature);
  const generator = mapView.getGenerator();
  const [area, centroid, bounds, measure] = [
    generator.area(feature),
    generator.centroid(feature),
    generator.bounds(feature),
    generator.measure(feature)
  ];
  console.log(area, centroid, bounds, measure);
};

const init = async () => {
  const canvas = document.querySelector('canvas.map');
  const geojson = await loadJson('./sample.json');
  drawMap({ ...geojson, canvas });
  const map = d3.select('canvas.map');
  map.data(geojson.features).on('click', reportFeature);
  // Feature一つ一つに対してイベントハンドラを設定する方法ではうまくいかない。
  // geojson.features.forEach(feature => {
  //   map.data(feature).on('click', reportFeature);    
  // });
};

init().then();

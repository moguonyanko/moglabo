/**
 * @fileoverview D3による包含チェックの確認用スクリプト
 */

const projection = d3.geoEquirectangular();

const getGenerator = context => {
  return d3.geoPath()
    .projection(projection)
    .context(context);
};

// DOM

let geojson;

// 描画コストが大きくないのであまり意味はない。
// オフスクリーンに描画する練習である。
const drawToOffscreen = ({ width, height, wrdP }) => {
  const offscreen = new OffscreenCanvas(width, height);
  const context = offscreen.getContext('2d');
  context.fillStyle = "#FF0000";
  const generator = getGenerator(context);

  const { features } = geojson;
  // 重なっている地物を強調する可能性を考慮すると、一回包含を検出しただけで
  // getContainsのループを打ち切るわけにはいかない。
  features.forEach(feature => {
    if (d3.geoContains(feature, wrdP)) {
      context.beginPath();
      generator(feature);
      context.fill();
    }
  });

  return offscreen;
};

const attentionFeature = () => {
  const layer = document.querySelector('canvas.attention');
  const { width, height } = layer;
  const wrdP = projection.invert(d3.mouse(layer));
  const offscreen = drawToOffscreen({ width, height, wrdP });
  const ctx = layer.getContext('2d');
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(offscreen, 0, 0);
};

const drawMap = () => {
  const layer = document.querySelector('canvas.map');
  const context = layer.getContext('2d');
  const generator = getGenerator(context);

  projection.fitExtent([[0, 0], [800, 400]], geojson);

  context.fillStyle = '#339999';
  context.beginPath();
  generator(geojson);
  context.fill();
};

const init = async () => {
  const response = await fetch('sample.json');
  if (!response.ok) {
    throw new Error(`Failded load json: ${response.status}`);
  }
  geojson = await response.json();
  drawMap();

  // d3.mouseでイベント発生時のポインタのデバイス座標を得るためにonメソッドを介して
  // イベントリスナーを設定する必要がある。
  d3.select('canvas.attention')
    .on('pointermove', attentionFeature);
};

init().then();

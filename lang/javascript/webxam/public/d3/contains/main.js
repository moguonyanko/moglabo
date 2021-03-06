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

// FirefoxはOffscreenCanvasのgetContextで2dを指定できない。
// そのため代替のcanvas要素を生成している。こちらはblobを得るメソッド名など
// OffscreenCanvasと差異がある。このクラスではその差異を吸収する。
class CanvasWrapper {
  #cvs;
  #ctx;

  constructor(width, height) {
    this.#cvs = new OffscreenCanvas(width, height);
    try {
      this.#ctx = this.#cvs.getContext('2d');
    } catch {
      this.#cvs = document.createElement('canvas');
      Object.assign(this.#cvs, { width, height });
      this.#ctx = this.#cvs.getContext('2d');
    }
  }

  get canvas() {
    return this.#cvs;
  }

  getContext() {
    return this.#ctx;
  }

  #toBlob = () => {
    try {
      return this.#cvs.convertToBlob();
    } catch {
      return new Promise((resolve, reject) => {
        try {
          this.#cvs.toBlob(resolve);
        } catch (err) {
          reject(err);
        }
      });
    }
  };

  async convertToBlob() {
    return await this.#toBlob();
  }
}

// 描画コストが大きくないのであまり意味はない。
// オフスクリーンに描画する練習である。
const drawToOffscreen = ({ width, height, wrdP }) => {
  const wrapper = new CanvasWrapper(width, height);
  const context = wrapper.getContext();
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

  return wrapper.canvas;
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

const blobUrls = [];

const getImage = async () => {
  const maps = document.querySelectorAll('.mapcontainer canvas');
  const { width, height } = maps[0];

  const wrapper = new CanvasWrapper(width, height);
  const offctx = wrapper.getContext();
  // source-overがデフォルト値なので指定しなくてもよい。確認のためのコードである。
  offctx.globalCompositeOperation = 'source-over';
  // 全てのcanvasの描画内容をOffscreenCanvasに合成する。
  maps.forEach(map => offctx.drawImage(map, 0, 0));

  const blob = await wrapper.convertToBlob();
  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl);
  blobUrls.push(blobUrl);
  // 以下の方法ではサブウインドウをリロードした時もURL.revokeObjectURLされてしまう。
  // URL.revokeObjectURLされたBlobURLの画像は保存できない。
  //subWindow.onbeforeunload = () => URL.revokeObjectURL(blobUrl);
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
    // 実際にはポインタの移動に伴って地物を強調描画する機会はそう多くないと思われる。
    // 例えばモバイルデバイスではpointermove自体が難しい操作である。
    // .on('pointermove', attentionFeature)
    .on('click', attentionFeature);

  d3.select('.imagegetter')
    .on('click', getImage);

  window.onbeforeunload = () => blobUrls.forEach(URL.revokeObjectURL);
};

init().then();

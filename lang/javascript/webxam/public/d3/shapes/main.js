/**
 * @fileoverview D3.jsの様々な図形を描画する練習用スクリプト
 */

const projection = d3.geoConicConformal()
  .scale(300)
  .rotate([15, -60]);

const createGenerator = context => {
  const generator = d3.geoPath()
    .projection(projection)
    .context(context);
  return generator;
};

class Drawer {
  constructor(canvas) {
    this.context = canvas.getContext('2d');
    this.generator = createGenerator(this.context);
  }

  clear() {
    const { width, height } = this.context.canvas;
    this.context.clearRect(0, 0, width, height);
  }

  drawFeature({ features, style, filled = false }) {
    this.context.save();
    Object.assign(this.context, style);
    this.context.beginPath();
    this.generator({ type: 'FeatureCollection', features })
    this.context.stroke();
    if (filled) {
      this.context.fill();
    }
    this.context.restore();
  }

  drawGraticule() {
    this.context.save();
    const graticule = d3.geoGraticule();
    this.context.beginPath();
    this.context.strokeStyle = '#CCCCCC';
    this.generator(graticule());
    this.context.stroke();
  }
}

const londonLonLat = [0.1278, 51.5074];
const newYorkLonLat = [-74.0059, 40.7128];
const interpolator = d3.geoInterpolate(londonLonLat, newYorkLonLat);

const line = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [londonLonLat, newYorkLonLat]
  }
};

const circle = {
  type: 'Feature',
  // 円はPolygonとして生成される。
  geometry: d3.geoCircle().center([0.1278, 51.5074]).radius(5)()
};

// DOM

const map = new Drawer(document.querySelector('canvas.map')),
  attention = new Drawer(document.querySelector('canvas.attention'));

const drawMap = geojson => {
  map.clear();

  map.drawFeature({
    ...geojson,
    style: {
      lineWidth: 0.5,
      strokeStyle: '#99CC99'
    }
  });
  
  map.drawGraticule();
  
  map.drawFeature({
    features: [line],
    style: {
      strokeStyle: '#FF6600'
    }
  });

  map.drawFeature({
    features: [circle],
    style: {
      strokeStyle: '#FF6600'
    }
  });
};

// 移動する様子を示す点だけはクリアと描画を繰り返す。
let factor = 0;
const drawAttention = () => {
  attention.clear();

  const point = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: interpolator(factor)
    }
  };

  attention.drawFeature({
    features: [point],
    style: {
      fillStyle: 'red'
    },
    filled: true
  });

  factor += 0.01;
  if (factor > 1) {
    factor = 0;
  }
  
  requestAnimationFrame(drawAttention);
};

const init = async () => {
  const response = await fetch('sample.json');
  if (!response.ok) {
    throw new Error(`JSON loading failded: ${response.status}`);
  }
  const geojson = await response.json();
  drawMap(geojson);
  requestAnimationFrame(drawAttention);
};

init().then();

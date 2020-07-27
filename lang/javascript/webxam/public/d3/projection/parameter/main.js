/**
 * @fileoverview 投影法のパラメータを調べるためのスクリプト
 * 参考:
 * https://bl.ocks.org/d3indepth/f7ece0ab9a3df06a8cecd2c0e33e54ef
 */

const loadJson = async path => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`JSON load error: ${response.status}`);
  }
  return await response.json();
}

const getProjection = type => d3[`geo${type}`]();

const getGenerator = ({ projection, context }) => {
  return d3.geoPath().projection(projection).context(context);
};

const setProjectionParam = ({ param, projection }) => {
  projection.scale(param.scale)
    .translate([param.x, param.y])
    .center([param.longitude, param.latitude])
    .rotate([param.yaw, param.pitch, param.roll]);
};

const drawGraticule = ({ context, generator }) => {
  context.save();
  context.lineWidth = 0.2;
  context.strokeStyle = '#663399';
  context.setLineDash([1, 1.5]);
  context.beginPath();
  generator(d3.geoGraticule()());
  context.stroke();  
  context.restore();
};

const drawFeature = ({ context, geojson, generator }) => {
  context.save();
  context.beginPath();
  context.lineWidth = 2.0;
  context.strokeStyle = '#003300';
  context.fillStyle = '#009966';
  generator({ type: 'FeatureCollection', ...geojson });
  context.stroke();
  context.fill();
  context.restore();
};

const getGeoCircle = ({ radius, precision }) => 
  d3.geoCircle().radius(radius).precision(precision);

const drawCircle = ({ circles, context, generator }) => {
  const geoCircle = getGeoCircle({ radius: 10, precision: 1 });
  context.save();
  context.lineWidth = 0.2;
  context.strokeStyle = 'rgb(204, 0, 0)';
  context.fillStyle = 'rgba(204, 0, 0, 0.2)';
  circles.forEach(center => {
    geoCircle.center(center);
    context.beginPath();
    generator(geoCircle());
    context.fill();
    context.stroke();
  });
  context.restore();
};

const drawCenter = ({ projection, context, generator, param }) => {
  const geoCircle = getGeoCircle({ radius: 2, precision: 1 });
  // 全く意味のないワールド->ピクセル変換だがinvertの振る舞いを調べるために行っている。
  const pixelPoint = projection([param.longitude, param.latitude]);
  const lonlat = projection.invert(pixelPoint);
  geoCircle.center(lonlat);
  context.save();
  context.lineWidth = 1.0;
  context.strokeStyle = "#990000";
  context.fillStyle = 'red';
  context.beginPath();
  generator(geoCircle());
  context.fill();
  context.stroke();
  context.restore();
};

const draw = ({ geojson, circles, context, projectionType, param }) => {
  const projection = getProjection(projectionType);
  setProjectionParam({ projection, param })
  const generator = getGenerator({ context, projection });

  drawFeature({ context, generator, geojson });
  drawCenter({ context, generator, param, projection });
  drawGraticule({ context, generator });
  drawCircle({ context, generator, circles });
};

// DOM

const appendProjections = async ({ projectionList }) => {
  const projections = await loadJson('../projections.json');
  const frag = projections.map((projection, index) => {
    const opt = document.createElement('option');
    opt.value = projection.type;
    opt.appendChild(document.createTextNode(projection.type));
    if (index === 0) {
      opt.setAttribute('selected', 'selected');
    }
    return opt;
  }).reduce((fragment, opt) => {
    fragment.appendChild(opt);
    return fragment;
  }, document.createDocumentFragment());
  projectionList.appendChild(frag);
}; 

const getParam = () => {
  const paramEles = document.querySelectorAll('.param input[data-event-target]');
  const param = Array.from(paramEles).map(ele => {
    const oneParam = { [ele.name]: parseInt(ele.value) };
    return oneParam;
  }).reduce((params, oneParam) => Object.assign(params, oneParam), {});
  return param;
};

const getProjectionType = () => document.querySelector('.projection').value;

const update = ({ geojson, circles, 
  canvas = document.querySelector('canvas.map') }) => {
  const projectionType = getProjectionType();
  const param = getParam();
  const context = canvas.getContext('2d'); 
  context.clearRect(0, 0, canvas.width, canvas.height);
  draw({ geojson, circles, param, projectionType, context });
};

const main = async () => {
  const projectionList = document.querySelector('.projection');
  await appendProjections({ projectionList });
  const geojson = await loadJson('../sample.json');
  const circles = await loadJson('circle.json');
  document.querySelector('main').addEventListener('change', event => {
    if (!('eventTarget' in event.target.dataset)) {
      return;
    }
    event.stopPropagation();
    update({ geojson, circles });
  });
  // Initial drawing
  update({ geojson, circles });
};

main().then();

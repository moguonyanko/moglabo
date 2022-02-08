/**
 * @fileoverview 数学系のAPI動作確認用スクリプト
 * 参考:
 * https://gis.stackexchange.com/questions/142866/converting-latitude-longitude-epsg4326-into-epsg3857
 * https://inspire.austrocontrol.at/ogcapi/ogc/features/tileMatrixSets/EPSG%3A3857?f=text%2Fhtml
 * https://stackoverflow.com/questions/37523872/converting-coordinates-from-epsg-3857-to-4326
 */

 const TOP_LEFT_CORNER = 20037508.34;

const convertEpsg4326ToEpsg3857 = ({ lon, lat }) => {
  const x = lon * TOP_LEFT_CORNER / 180;
  const y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180) * 
    (TOP_LEFT_CORNER / 180);
  return { x, y };
};

const convertEpsg3857ToEpsg4326 = ({ x, y }) => {
  let lon = x * 180 / TOP_LEFT_CORNER;
  let lat = y / (TOP_LEFT_CORNER / 180);
  const exponent = (Math.PI / 180) * lat;
  lat = Math.atan(Math.exp(1) ** exponent);
  lat = lat / (Math.PI / 360);
  lat -= 90;
  return { lon, lat };
};

// eslint-disable-next-line no-unused-vars
const runTest = () => {
  let [lon, lat] = [139.756360, 35.653454];
  const { x, y } = convertEpsg4326ToEpsg3857({ lon, lat });
  // X=15557606.850359, Y=4253041.339737
  console.log(`X=${x}, Y=${y}`);
  const pos = convertEpsg3857ToEpsg4326({ x, y });
  console.log(`lon=${pos.lon}, lat=${pos.lat}`);
};

// DOM

// Javaであれば抽象クラスとして定義される。
class BaseConvertEPSG extends HTMLElement {
  constructor(id) {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const template = document.getElementById(id);
    const content = template.content;
    shadowRoot.appendChild(content.cloneNode(true));
  }

  connectedCallback() {
    const root = this.shadowRoot;
    root.addEventListener('click', event => {
      if (event.target.id === 'convert') {
        event.stopPropagation();
        this.convert();
      }
    });
  }
}

class ConvertEPSG4326To3856 extends BaseConvertEPSG {
  // 引数なしコンストラクタはcustomElements.defineされるクラスにあればいい。
  constructor() {
    super('convert-epsg4326to3856');
  }

  convert() {
    const root = this.shadowRoot;
    const [lon, lat] = [
      parseFloat(root.getElementById('lon').value),
      parseFloat(root.getElementById('lat').value)
    ];
    const { x, y } = convertEpsg4326ToEpsg3857({ lon, lat });
    root.getElementById('x').textContent = x;
    root.getElementById('y').textContent = y;
  }
}

class ConvertEPSG3857To4326 extends BaseConvertEPSG {
  constructor() {
    super('convert-epsg3857to4326');
  }

  convert() {
    const root = this.shadowRoot;
    const [x, y] = [
      parseFloat(root.getElementById('x').value),
      parseFloat(root.getElementById('y').value)
    ];
    const { lon, lat } = convertEpsg3857ToEpsg4326({ x, y });
    root.getElementById('lon').textContent = lon;
    root.getElementById('lat').textContent = lat;
  }
}

const defineElements = () => {
  customElements.define('convert-epsg4326to3856', ConvertEPSG4326To3856);
  customElements.define('convert-epsg3857to4326', ConvertEPSG3857To4326);
};

const init = () => {
  runTest();
  defineElements();
};

init();
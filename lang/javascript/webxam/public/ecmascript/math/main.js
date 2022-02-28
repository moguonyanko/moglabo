/**
 * @fileoverview 数学系のAPI動作確認用スクリプト
 * 参考:
 * https://gis.stackexchange.com/questions/142866/converting-latitude-longitude-epsg4326-into-epsg3857
 * https://inspire.austrocontrol.at/ogcapi/ogc/features/tileMatrixSets/EPSG%3A3857?f=text%2Fhtml
 * https://stackoverflow.com/questions/37523872/converting-coordinates-from-epsg-3857-to-4326
 */

/* 計算過程を分かりやすくするために各計算を分解して記述している。 */
const TOP_LEFT_CORNER = 20037508.34;

// EPSG4326=緯度経度
// EPSG3857=Webメルカトル

const convertEpsg4326ToEpsg3857 = ({ lon, lat }) => {
  const x = lon * TOP_LEFT_CORNER / 180;

  let y = 90 + lat;
  y = y * (Math.PI / 360);
  y = Math.tan(y);
  y = Math.log(y);
  y = y / (Math.PI / 180);
  y = y * (TOP_LEFT_CORNER / 180);

  return { x, y };
};

const convertEpsg3857ToEpsg4326 = ({ x, y }) => {
  const lon = x * 180 / TOP_LEFT_CORNER;

  let lat = y / (TOP_LEFT_CORNER / 180);
  lat = (Math.PI / 180) * lat;
  lat = Math.E ** lat;
  lat = Math.atan(lat);
  lat = lat / (Math.PI / 360);
  lat = lat - 90;
  
  return { lon, lat };
};

const deg2rad = deg => {
  return deg / (180 / Math.PI);
};

// 参考: 
// https://developer.mozilla.org/ja/docs/Web/API/WebGL_API/Matrix_math_for_the_web
const rotatePositon = ({ position, degrees }) => {
  const { x, y } = position;
  const distance = Math.sqrt(x ** 2 + y ** 2);
  const radians = deg2rad(degrees);
  return {
    x: Math.cos(radians) * distance,
    y: Math.sin(radians) * distance
  };
};

// eslint-disable-next-line no-unused-vars
const runTest = () => {
  let [lon, lat] = [139.756360, 35.653454];
  const { x, y } = convertEpsg4326ToEpsg3857({ lon, lat });
  // X=15557606.850359, Y=4253041.339737
  console.log(`lon=${lon}, lat=${lat} -> X=${x}, Y=${y}`);
  const pos = convertEpsg3857ToEpsg4326({ x, y });
  console.log(`X=${x}, y=${y} -> lon=${pos.lon}, lat=${pos.lat}`);

  const position = { x, y };
  const degrees = 60;
  const transformedPositon = rotatePositon({ position, degrees });
  console.log(transformedPositon);
};

// DOM

// Javaであれば抽象クラスとして定義するところである。
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

class CalcCbrt extends HTMLInputElement {
  constructor() {
    super();
    this.clear();
    const initialValue = parseInt(this.getAttribute('value'));
    if (!isNaN(initialValue)) {
      this.output(initialValue);
    } 
  }

  get resultArea() {
    return document.getElementById(this.getAttribute('resultid'));
  }

  clear() {
    this.resultArea.textContent = '';
    // リロード前の入力値をvalue属性の値で上書きして初期化する。
    this.value = this.getAttribute('value');
  }

  output(value) {
    this.resultArea.textContent = Math.cbrt(value);
  }

  connectedCallback() {
    this.addEventListener('keyup', event => {
      // getAttributeではなくevent経由でないと入力値を受け取れない。
      const value = parseInt(event.target.value);
      this.output(value);
    });
  }
}

class RotateDegrees extends HTMLInputElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener('keyup', event => {
      const degrees = parseFloat(event.target.value);
      const position = {
        x: parseFloat(document.querySelector('.rotate-x').value),
        y: parseFloat(document.querySelector('.rotate-y').value)
      };
      const result = rotatePositon({ position, degrees });
      document.querySelector('.result-x').textContent = result.x;
      document.querySelector('.result-y').textContent = result.y;
    });
  }
}

const defineElements = () => {
  customElements.define('convert-epsg4326to3856', ConvertEPSG4326To3856);
  customElements.define('convert-epsg3857to4326', ConvertEPSG3857To4326);
  customElements.define('calc-cbrt', CalcCbrt, { extends: 'input' });
  customElements.define('rotate-degrees', RotateDegrees, { extends: 'input' })
};

const init = () => {
  runTest();
  defineElements();
};

init();
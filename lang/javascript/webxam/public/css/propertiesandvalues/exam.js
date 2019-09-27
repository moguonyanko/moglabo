/**
 * @fileoverview CSS Properties and Values API関連調査用スクリプト
 */

class CSSRegisterProperties {
  constructor() {
    const props = {
      name: '--sample-color',
      syntax: '<color>', // syntaxを指定していなくても結果は変わらない。
      inherits: false,
      initialValue: 'red'
    };

    CSS.registerProperty(props);
  }  
}

const samples = {
  CSSRegisterProperties
};

const init = () => {
  samples.forEach(Sample => new Sample);
};

window.addEventListener('DOMConetntLoaded', init);

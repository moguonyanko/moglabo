/**
 * @fileoverview CSS Properties and Values API関連調査用スクリプト
 * 参考:
 * https://web.dev/css-props-and-vals/
 */

class CSSRegisterProperties {
  constructor() {
    const props = {
      name: '--sample-color',
      // 参考:
      // https://drafts.csswg.org/css-values-3/#value-examples
      syntax: '<color>',
      inherits: false,
      initialValue: 'red' // 不正なプロパティが指定された時に使われる値
    };

    CSS.registerProperty(props);
  }  
}

const samples = {
  CSSRegisterProperties
};

const init = () => {
  Object.values(samples).forEach(Sample => new Sample);
};

init();

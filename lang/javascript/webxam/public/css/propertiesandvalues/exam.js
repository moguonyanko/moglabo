/**
 * @fileoverview CSS Properties and Values API関連調査用スクリプト
 * 参考:
 * https://web.dev/css-props-and-vals/
 */

const randParam = () => parseInt(Math.random() * 255);

const getRandomColor = () => {
  return `rgb(${randParam()}, ${randParam()}, ${randParam()})`;
};

class CSSRegisterProperties {
  constructor() {
    const props = {
      name: '--sample-color',
      // 参考:
      // https://drafts.csswg.org/css-values-3/#value-examples
      syntax: '<color>',
      inherits: false,
      initialValue: getRandomColor() // 不正なプロパティが指定された時に使われる値
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

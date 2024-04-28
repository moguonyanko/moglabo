/**
 * @fileoverview Preactのインデックスページ用スクリプト
 * 参考:
 * https://preactjs.com/guide/v10/getting-started/
 */
import { h, render } from 'https://esm.sh/preact';
import htm from 'https://esm.sh/htm';

const html = htm.bind(h);

const Header = props => {
  return html`<header>
  <a href="${props.homepath}">home</a>
  <h1>${props.title}</h1>
  </header>`
}

const init = () => {
  render(html`<${Header} title="Preact" homepath="../../" />`,
    document.body)
}

init()

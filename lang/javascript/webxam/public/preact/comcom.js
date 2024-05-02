/**
 * @name comcom.js
 * @fileoverview 共通のコンポーネントをまとめたスクリプトです。
 */
import { h, Component } from 'https://esm.sh/preact'
import htm from 'https://esm.sh/htm'

const html = htm.bind(h)

/**
 * @description ページのタイトルやホームへのリンクを備えた共通のヘッダです。
 */
class Header extends Component {
  render(props) {
    return html`<header>
    <a href="${props.homepath}">home</a>
    <h1>${props.title}</h1>
    </header>`
  }
}

export {
  Header,
  html
}

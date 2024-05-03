/**
 * @fileoverview Preactのコンテキスト調査用スクリプト
 * 参考:
 * https://preactjs.com/guide/v10/context
 */
import { render, createContext } from 'https://esm.sh/preact'
import { useContext } from 'https://esm.sh/preact/hooks'
import { html } from '../comcom.js'

/**
 * TODO: コンテキストを使う意味がいまいち分からない。
 */
const Theme = createContext('light')

// function ThemedButton(props) {
//   return html`<${Theme.Consumer}>
//       ${theme => {
//         return <button {...props} class={'btn ' + theme}>サンプルボタン</button>
//       }}
//     </ ${Theme.Consumer}>`
// }

function DisplayTheme() {
  const theme = useContext(Theme)
  return html`<p>現在のテーマ: ${theme}</p>`
}

function DisplayContainer() {
  return html`<div><${DisplayTheme} /></div>`
}

function ComntextSample() {
  return html`<${Theme.Provider} value="light">
      <${DisplayContainer} />
    </${Theme.Provider}>`
}

const init = () => {
  const contextContaienr = document.querySelector('.container.createContext')
  render(html`<${ComntextSample} />`, contextContaienr)
}

init()

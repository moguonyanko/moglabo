/**
 * @fileoverview Preactのコンポーネント調査用スクリプト
 */
import { h, render, Component } from 'https://esm.sh/preact'
import htm from 'https://esm.sh/htm'
import { Header } from '../comcom.js'

const html = htm.bind(h)

class Greeting extends Component {
  constructor(props) {
    super()
    this.state = {
      value: props.value,
      name: props.name  
    }
  }

  onInput = event => {
    this.setState({
      value: event.currentTarget.value
    })    
  }

  onSubmit = event => {
    event.preventDefault()
    this.setState({
      name: this.state.value // getState()は存在しない。
    })   
  }

  render() {
    return html`
      <div>
        <h1>こんにちは、${this.state.name}</h1>
        <form onSubmit=${this.onSubmit}>
          <input type="text" value=${this.state.value} onInput=${this.onInput} />
          <button type="submit">更新</button>
        </form>
      </div>
    `
  }
}

const init = () => {
  render(html`<${Header} title="コンポーネント" homepath="../../" />`,
    document.body)
  render(html`<${Greeting} name="NO NAME" value="𩸽太郎" />`, document.querySelector('main'))
}

init()

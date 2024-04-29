/**
 * @fileoverview Preactのコンポーネント調査用スクリプト
 */
import { h, render, Component } from 'https://esm.sh/preact'
import htm from 'https://esm.sh/htm'
import { Header as MyHeader } from '../comcom.js'

const html = htm.bind(h)

class Greeting extends Component {
  constructor(props) {
    super()
    this.state = {
      value: props.value,
      name: props.name
    }
  }

  // arrow-functonで定義しないとsetStateを参照できない。
  onInput = event => {
    // 空文字の場合も保存しないと最後に入力された文字が表示される。
    this.setState({
      value: event.currentTarget.value
    })
  }

  // arrow-functonで定義しないとsetStateを参照できない。
  onSubmit = event => {
    event.preventDefault()
    if (!this.state.value) { // 空文字が保存されていたら何もしない。
      return
    }
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

class MyClock extends Component {
  constructor() {
    super()
    this.updateTime() // 時刻初期化
  }

  updateTime() {
    this.setState({ time: Date.now() })
  }

  componentDidMount() {
    this.intervalId = setInterval(() => this.updateTime(), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  render() {
    const timeState = new Date(this.state.time)
    return html`<div>${timeState.toLocaleString()}</div>`
  }
}

const init = () => {
  render(html`<${MyHeader} title="コンポーネント" homepath="../../" />`,
    document.body)

  const mainEle = document.querySelector('main')
  render(html`<${Greeting} name="NO NAME" value="𩸽太郎" /><${MyClock} />`,
    mainEle)
  // 別にrenderすると他の要素を上書きしてしまうのでまとめてrenderする必要がある。
  // render(html`<${Clock} />`, mainEle)
}

init()

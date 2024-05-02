/**
 * @fileoverview Preactのコンポーネント調査用スクリプト
 */
import { h, render, Component, Fragment } from 'https://esm.sh/preact'
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
    // この例ではあまり意味がないがFragmentを使うと要素群に対して単一のルート要素を持たせやすくなる。
    return html`<${Fragment}>
      <div part="component">
        <h1>こんにちは、${this.state.name}</h1>
        <form onSubmit=${this.onSubmit}>
          <input type="text" value=${this.state.value} onInput=${this.onInput} />
          <button type="submit">更新</button>
        </form>
      </div></${Fragment}>`
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
    if (!this.state.errored) {
      const timeState = new Date(this.state.time)
      return html`<div part="component">${timeState.toLocaleString()}</div>`
    } else {
      return html`<div part="component">${this.state.message}</div>`
    }
  }
}

class BrokenMyClock extends MyClock {
  constructor() {
    super()
    setTimeout(() => { throw new Error('Broken Clock!') }, 3000)
  }

  // TODO: イベントが発生しない。仮想DOMではinput要素しかイベント発生源になり得ないのか？
  // onPointerUp() {
  //   throw new Error('Broken Clock!')
  // }

  // TODO: 例外が発生しても呼び出されない。
  componentDidCatch(error) {
    this.setState({ errored: true, message: error.message })
  }
}

function MyList(props) {
  const content = JSON.parse(props.items).map(item =>
    html`<${Fragment} key=${item.id}>
    <dt>${item.name}</dt>
    <dd>${item.price}</dd>
  </${Fragment}>`)
  return html`<div part="component"><dl>${content}</dl></div>`
}

const sampleItems = [
  {
    name: 'Apple', price: 200
  },
  {
    name: 'Orange', price: 230
  },
  {
    name: 'Melon', price: 1000
  },
]

const init = () => {
  render(html`<${MyHeader} title="コンポーネント" homepath="../../" />`,
    document.body)

  // 複数のコンポーネントを同じ要素に対して個別にrenderすると他のコンポーネントを上書きしてしまうので
  // その場合は全ての要素を一度にrenderする必要がある。
  const container = document.querySelector('.container')
  container.attachShadow({ mode: 'open' })
  render(html`<${Greeting} name="NO NAME" value="𩸽太郎" />
    <p>時計</p>
    <${MyClock} />
    <p>エラーが発生する時計</p>
    <${BrokenMyClock} />
    <p>リスト</p>
    <${MyList} items="${JSON.stringify(sampleItems)}" />`, container.shadowRoot) // コンポーネントにclassを指定しても除去される。
  // なぜか初期化エラーになる。renderを複数回呼び出すのは好ましくないのかもしれない。
  // render(html`<${MyClock} />`, document.getElementById('myclock'))
  // render(html`<${BrokenMyClock} />`, document.getElementById('brokenmyclock'))
}

init()

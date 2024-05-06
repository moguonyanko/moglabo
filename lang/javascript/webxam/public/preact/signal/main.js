/**
 * @fileoverview Preactのシグナル調査用スクリプト
 * ESM経由で取得したモジュールでは正常に動作していない。signal()やuseSignal()を呼び出しても
 * コンポーネントの変更を検知できなかったりエラーが発生したりする。
 * 参考:
 * https://preactjs.com/guide/v10/signals/
 */
import { render, Component } from 'https://esm.sh/preact'
import { useState, useMemo } from 'https://esm.sh/preact/hooks'
import { useSignal, signal, effect } from "https://esm.sh/@preact/signals"
import { html } from '../comcom.js'

const signalCount = signal(0)

function SignalCounterFunction() {
// TODO: effectに渡した関数が呼び出されない。
  effect(() => console.log(signalCount))

  const onClick = () => {
    return signalCount.value++
  }

  // TODO: 値を更新しても再レンダリングされない。
  return html`<div>
  <span>${signalCount.value}</span>
  <button onClick=${() => signalCount.value++}>加算</button>
  </div>`
}

/**
 * クラスコンポーネントを使ってもシグナルの値に従って再レンダリングは行われない。
 */
class SignalCounterClass extends Component {
  // useSignalを呼び出しただけでエラーが発生する。
  #signalCount = useSignal(0)

  constructor() {
    super()
    effect(() => console.log(this.#signalCount))
  }

  onClick() {
    this.#signalCount.value++
    // renderを呼び直して再レンダリングしてもsignalの意味がない。
    renderCounters()
    return this.#signalCount.value
  }

  // コンポーネントの初期化時にエラーが発生しても呼び出されない。
  componentDidCatch(error) {
    console.debug(error)
  }

  render() {
    return html`<div>
    <span>${this.#signalCount.value}</span>
    <button onClick=${this.onClick.bind(this)}>加算</button>
    </div>`  
  }
}

function renderCounters() {
  const counterFunctionContainer = document.querySelector('.container.signalCounterFunction')
  render(html`<${SignalCounterFunction} />`, counterFunctionContainer)

  const counterClassContainer = document.querySelector('.container.signalCounterClass')
  try {
    render(html`<${SignalCounterClass} />`, counterClassContainer)
  } catch (err) {
    render(html`<div class="error">${err.message}</div>`, counterClassContainer)
  }
}

const init = () => {
  renderCounters()
}

init()

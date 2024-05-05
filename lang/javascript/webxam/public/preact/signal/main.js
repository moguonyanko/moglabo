/**
 * @fileoverview Preactのシグナル調査用スクリプト
 * 参考:
 * https://preactjs.com/guide/v10/signals/
 */
import { render, Component } from 'https://esm.sh/preact'
import { useState } from 'https://esm.sh/preact/hooks'
import { useSignal, signal, effect } from "https://esm.sh/@preact/signals"
//import { useSignal, signal, effect } from "https://esm.sh/@preact/signals-react"
import { html } from '../comcom.js'

const signalCount = signal(0)

function SignalCounterFunction() {
//  const signalCount = useSignal(0)
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
  constructor() {
    super()
    effect(() => console.log(signalCount))
  }

  onClick() {
    signalCount.value++
    this.render() // renderを呼び直しても再レンダリングされない。されたとしてもsignalの意味はないが。
    return signalCount.value
  }

  render() {
    return html`<div>
    <span>${signalCount.value}</span>
    <button onClick=${this.onClick.bind(this)}>加算</button>
    </div>`  
  }
}

const init = () => {
  const counterContainer = document.querySelector('.container.signalCounter')
  render(html`<${SignalCounterFunction} /><${SignalCounterClass} />`, counterContainer)
}

init()

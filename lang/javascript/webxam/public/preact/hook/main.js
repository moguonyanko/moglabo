/**
 * @fileoverview Preactのフック調査用スクリプト
 * 参考:
 * https://preactjs.com/guide/v10/hooks/
 */
import { render, Fragment } from 'https://esm.sh/preact'
import { useState, useReducer, useRef, useEffect, useErrorBoundary } from 'https://esm.sh/preact/hooks'
import { html } from '../comcom.js'

const useCounter = () => {
  const [count, setCount] = useState(0)
  const increment = () => setCount(count + 1)
  const decrement = () => setCount(count - 1)
  // 関数を渡すこともできる。結果は上と同じ。
  //const decrement = () => setCount(currentCount => currentCount - 1)

  return { count, increment, decrement }
}

const MyCounterJa = () => {
  const { count, increment, decrement } = useCounter()

  return html`<span>カウンター: ${count}</span>
  <button onClick=${increment}>加算</button>
  <button onClick=${decrement}>減算</button>`
}

const MyCounterEn = () => {
  const { count, increment, decrement } = useCounter()

  return html`<span>Counter: ${count}</span>
  <button onClick=${increment}>Increment</button>
  <button onClick=${decrement}>Decrement</button>`
}

const counterActions = {
  increment: count => count + 1,
  decrement: count => count - 1,
  reset: () => 0
}

const myReducer = (count, actionName) => {
  if (actionName in counterActions) {
    return counterActions[actionName](count)
  } else {
    throw new Error(`${actionName} is unsupported`)
  }
}

const MyReducerCounter = () => {
  const initialCount = 0
  const [count, dispatch] = useReducer(myReducer, initialCount)

  return html`<${Fragment}>
  <span>${count}</span>
  <button onClick=${() => dispatch('increment')}>+1</button>
  <button onClick=${() => dispatch('decrement')}>-1</button>
  <button onClick=${() => dispatch('reset')}>reset</button>
  </${Fragment}>`
}

const EmphasisBox = () => {
  const box = useRef(null)
  const onPointerEnter = () => {
    if (box.current) {
      box.current.classList.add('emphasis')
    }
  }
  const onPointerOut = () => {
    if (box.current) {
      box.current.classList.remove('emphasis')
    }
  }
  return html`<div ref=${box} onPointerEnter=${onPointerEnter} 
    onPointerOut=${onPointerOut}>SAMPLE BOX</div>`
}

const EffectHeader = props => {
  // ページ読み込み時しか呼び出されない。
  // イベントや時間の変化を補足して副作用を肩代わりしてくれるわけではない。
  useEffect(() => {
    const header = document.querySelector('.useEffect .sampleHeader')
    header.textContent = props.value
    // クリーンアップ処理の関数を返してもページ読み込み時しかuseEffectされないのは変わらない。
    return () => header.textContent = '' 
  }, [props.value])

  // TODO: currentが常にnullになる。onInputに対してはuseRefは使えないのか？
  // const elementRef = useRef(null)
  // const onInput = () => {
  //   if (elementRef.current) {
  //     elementRef.current.textContent = props.value
  //   }
  // }
  // return html`<input type="text" onInput=${onInput} />`

  // propsを参照していないとuseEffectが呼び出されない。
  // return html`<input type="text" value="${props.value}" />`
  // inputではなくcontenteditableにしてもページ読み込み完了後の変更は反映されない。
  return html`<div contenteditable="true">${props.value}</div>`
}

const ChildComponent = props => {
  const [errorCount, setErrorCount] = useState(0)
  const incErrorCount = () => setErrorCount(errorCount + 1)

  // resetErrorでコンポーネントの生成が最初からやり直しされるのでステートを元に処理を分岐しようとしても
  // 初期値で判定され続けてしまうのでうまくいかない。
  // if (errorCount === 0) {
  //   incErrorCount()
  //   throw new Error(`${props.name}:ERROR TEST`)
  // }

  const onClick = () => {
    if (errorCount > 0) {
      return
    }
    incErrorCount()
    throw new Error(`${props.name}:${new Date().toLocaleString()}`)
  }

  return html`<p>${props.name}</p><button onClick=${onClick}>エラー発生</button>`
}

// TODO: エラーが発生しても呼び出されない。
const reportError = error => {
  alert(error.message)
}

const ParentComponent = props => {
  const [error, resetError] = useErrorBoundary(reportError)

  if (!error) {
    return html`<div>${props.children}</div>`
  } else { // ここに入るのはコンポーネント初期化時にエラーが発生した場合だけである。
    return html`<button onClick=${resetError}>reset</button>`
  }
}

const init = () => {
  const counterContainer = document.querySelector('.counter.useState')
  render(html`<${MyCounterJa} /><${MyCounterEn} />`, counterContainer)

  const reducerContainer = document.querySelector('.counter.useReducer')
  render(html`<${MyReducerCounter} />`, reducerContainer)

  const refContainer = document.querySelector('.useRef')
  render(html`<${EmphasisBox} />`, refContainer)

  const effectContainer = document.querySelector('.useEffect')
  render(html`<${EffectHeader} value="TEST" />`, effectContainer)

  const errorBoundaryContainer = document.querySelector('.useErrorBoundary')
  render(html`<${ParentComponent}>
  <${ChildComponent} name="ChildA" />
  <${ChildComponent} name="ChildB" />
  </ ${ParentComponent}>`, errorBoundaryContainer)
}

init()

/**
 * @fileoverview Preactのフック調査用スクリプト
 * 参考:
 * https://preactjs.com/guide/v10/hooks/
 */
import { render, Component, Fragment } from 'https://esm.sh/preact'
import { useState, useCallback, useReducer } from 'https://esm.sh/preact/hooks'
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

const init = () => {
  const counterContainer = document.querySelector('.counter.useState')
  render(html`<${MyCounterJa} /><${MyCounterEn} />`, counterContainer)
  const reducerContainer = document.querySelector('.counter.useReducer')
  render(html`<${MyReducerCounter} />`, reducerContainer)
}

init()

/**
 * @fileoverview Preactのフック調査用スクリプト
 * 参考:
 * https://preactjs.com/guide/v10/hooks/
 */
import { render, Component, Fragment } from 'https://esm.sh/preact'
import { useState, useCallback } from 'https://esm.sh/preact/hooks'
import { html } from '../comcom.js'

const useCounter = () => {
  const [count, setCount] = useState(0)
  const increment = useCallback(() => {
    setCount(count + 1)
  }, [count])

  return { count, increment }
}

const MyCounterJa = () => {
  const { count, increment } = useCounter()

  return html`<span>カウンター: ${count}</span>
  <button onClick=${increment}>加算</button>`
}

const MyCounterEn = () => {
  const { count, increment } = useCounter()

  return html`<span>Counter: ${count}</span>
  <button onClick=${increment}>Increment</button>`
}

const init = () => {
  const counterContainer = document.querySelector('.counter')
  render(html`<${MyCounterJa} /><${MyCounterEn} />`, counterContainer)
}

init()

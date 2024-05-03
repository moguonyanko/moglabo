/**
 * @fileoverview Preactのシグナル調査用スクリプト
 * 参考:
 * https://preactjs.com/guide/v10/signals/
 */
import { render, Fragment } from 'https://esm.sh/preact'
import { useState, useReducer, useRef, useEffect, useErrorBoundary } from 'https://esm.sh/preact/hooks'
import { signal } from "@preact/signals"
import { html } from '../comcom.js'

const signalCount = signal(0)

function SignalCounter() {
  return html`<${Fragment}>
  <span>${signalCount}</span>
  <button onClick=${() => signalCount.value++}>加算</button>
  </${Fragment}>`
}

const init = () => {
  const counterContainer = document.querySelector('.counter')
  render(html`<${SignalCounter} />`, counterContainer)
}

init()

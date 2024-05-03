/**
 * @fileoverview Preactのリファレンス調査用スクリプト
 * 参考:
 * https://preactjs.com/guide/v10/refs
 */
import { render, Component, createRef } from 'https://esm.sh/preact'
import { useState } from 'https://esm.sh/preact/hooks'
import { html } from '../comcom.js'

class RefSample extends Component {
  #ref = createRef()

  componentDidMount() {
    this.#ref.current.textContent = `Mount:${new Date().toLocaleString()}`
  }

  render() {
    return html`<div ref=${this.#ref}></div>`
  }
}

class SizeViewer extends Component {
  #state = {
    width: 0, height: 0
  }

  #ref = createRef()

  #updateSize() {
    if (!this.#ref.current) {
      return
    }
    const dimensions = this.#ref.current.getBoundingClientRect()
    this.setState({
      width: dimensions.width, 
      height: dimensions.height
    })
  }

  componentDidMount() {
    this.#updateSize()
  }

  // TODO: ウインドウをリサイズしても呼び出されない。
  onResize() {
    this.#updateSize()
  }

  render(_, { width, height }) {
    return html`
      <div ref=${this.#ref} onResize=${this.onResize}>
      Width: ${width}, Height: ${height}
      </div>`
  }
}

const init = () => {
  const refContainer = document.querySelector('.container.createRef')
  render(html`<${RefSample} />`, refContainer)

  const sizeViewerContainer = document.querySelector('.container.sizeViewer')
  render(html`<${SizeViewer} />`, sizeViewerContainer)
}

init()

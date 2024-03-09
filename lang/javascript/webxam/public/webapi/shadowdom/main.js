/**
 * @fileoverview ShadowDOMについて調べるためのスクリプト
 */

class MyButtonElement extends HTMLElement {
  constructor() {
    super()

    if (this.shadowRoot) { // 宣言型ShadowDOMが実装されているブラウザ
      this.shadowRoot.addEventListener('click', event => {
        if (event.target.className === 'runner') {
          const output = document.querySelector('.output')
          output.textContent = `テスト:${new Date().toLocaleString()}`
        }
      })
    } else {
      const shadow = this.attachShadow({ mode: 'open' })
      shadow.innerHTML = '<p>宣言型ShadowDOM未実装</p>'
    }
  }
}

customElements.define('my-button', MyButtonElement)

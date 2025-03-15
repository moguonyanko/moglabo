/**
 * @fileoverview Popover API調査用スクリプト
 * 参考:
 * https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API
 */

const getRandomHexColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const addListener = () => {
  const togglePopover = document.getElementById('togglePopover')
  togglePopover.addEventListener('command', event => {
    // カスタムコマンドは--で始める必要がある。
    if (event.command === '--change-popover-bg-color') {
      togglePopover.style.backgroundColor = getRandomHexColor()
    }
  })
}

const init = () => {
  addListener()

  customElements.define('my-dialog', class extends HTMLElement {
    // 宣言型ShadowDOMでCustomElementsを定義するならconstructorは無くてもいい。
    // constructor() {
    //   super()

    //   const shadow = this.attachShadow({ mode: 'open' })
    //   shadow.innerHTML += `
    //     <div popover>
    //     <button command="hide-popover">非表示</button>
    //     <p>CustomElementでのpoover</p>
    //     </div>
    //   `
    // }

    connectedCallback() {
      const popover = this.querySelector('#custom-popover[popover]')
      // CustomElementsはShadowDOMを使うのでcommandforにidを渡すのが難しい。
      // そこでcustomForElementにpopover要素自体を渡している。
      this.shadowRoot.querySelector('button').commandForElement = popover      
    }
  })
}

init()

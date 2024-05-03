/**
 * @fileoverview Preactのフォーム調査用スクリプト
 * 参考:
 * https://preactjs.com/guide/v10/forms/
 */
import { render } from 'https://esm.sh/preact'
import { useState } from 'https://esm.sh/preact/hooks'
import { html } from '../comcom.js'

const SimpleTodoForm = props => {
  const [value, setValue] = useState(props.defaultValue)

  const onSubmit = event => {
    alert(`登録:${value}`) // 実際はここでサーバへの送信を行う。
    event.preventDefault()
  }

  const onInput = event => {
    setValue(event.currentTarget.value)
  }

  return html`
    <form onSubmit=${onSubmit}>
      <input type="text" value=${value} onInput=${onInput} />
      <p>入力値: ${value}</p>
      <button type="submit">登録</button>
    </form>`
}

const SelectForm = props => {
  const [value, setValue] = useState(props.defaultValue)

  const onSubmit = event => {
    alert(`登録:${value}`) // 実際はここでサーバへの送信を行う。
    event.preventDefault()
  }

  const onChange = event => {
    setValue(event.currentTarget.value)
  }

  return html`
    <form onSubmit=${onSubmit}>
      <select value=${value} onChange=${onChange}>
        <option value="apple">りんご</option>
        <option value="orange">みかん</option>
        <option value="banana">バナナ</option>
      </select>      
      <button type="submit">登録</button>
    </form>`
}

const init = () => {
  const simpleFormContainer = document.querySelector('.container.simpleForm')
  render(html`<${SimpleTodoForm} defaultValue="PreactTest" />`, simpleFormContainer)

  const selectFormContainer = document.querySelector('.container.selectForm')
  render(html`<${SelectForm} defaultValue="banana" />`, selectFormContainer)
}

init()

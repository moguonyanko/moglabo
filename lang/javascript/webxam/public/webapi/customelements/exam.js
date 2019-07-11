/**
 * @fileoverview CustomElements調査用スクリプト
 */

class MyAutoCompleteForm extends HTMLElement {
  constructor() {
    super();

    const t = document.getElementById('auto-complete-form');
    this.attachShadow({ mode: 'open' }).appendChild(t.cloneNode(true).content);
  }

  connectedCallback() {
    this.shadowRoot.addEventListener('submit', event => {
      if (event.target.type !== 'button') {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      const [userId, password] =
        Array.from(this.shadowRoot.querySelectorAll('input')).map(el => el.value);

      document.querySelector('.output').innerHTML +=
        `${userId}:${password}<br />`;
    }, { passive: false });
  }
}

customElements.define('my-autocomplete-form', MyAutoCompleteForm);


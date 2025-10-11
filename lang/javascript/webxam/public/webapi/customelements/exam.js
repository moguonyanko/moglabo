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

class CustomMessage extends HTMLElement {
  constructor() {
    super();

    const t = document.getElementById('custom-message');
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(t.cloneNode(true).content);
  }

  dumpAssigned() {
    const slots = this.shadowRoot.querySelectorAll('slot');
    slots.forEach(slot => {
      console.log(slot.assignedNodes());
    });
  }

  connectedCallback() {
    this.shadowRoot.addEventListener('slotchange', () => {
      this.dumpAssigned();
    });
  }
}

const getInnerHTML = ({ tag, includeShadowRoots }) => {
  if (typeof tag.getInnerHTML === 'function') {
    return tag.getInnerHTML({ includeShadowRoots })
  } else {
    return ''
  }
}

const getTemplateInnerHTMLList = ({ query, includeShadowRoots = true }) => {
  const templates = Array.from(document.querySelectorAll(query));
  return templates.map(t => getInnerHTML({ tag: t, includeShadowRoots }));
};

class SampleDeclarativeElement extends HTMLElement {
  constructor() {
    super();

    // attachInternalsを呼び出すとthis.shadowRootはnullになる。
    // CustomElementsが明示的に宣言されているかどうかに関わらず
    // 同じ処理を行いたいならattachInternalsを用いる。
    const internals = this.attachInternals();
    if (internals.shadowRoot) {
      internals.shadowRoot.addEventListener('click', () => {
        const shadowRootAttr = internals.shadowRoot.mode;
        const value = `${this.id}, shadowroot=${shadowRootAttr}`;
        alert(value);
      });
    } 
  }
}

class CustomProfile extends HTMLElement {
  constructor () {
    super();
    const template = document.getElementById('custom-profile');
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.cloneNode(true).content);
  }
}

/**
 * built-inのCustomElementsではないのでHTMLSelectElementは継承できない。
 * ユーザーによって設定された値をこの要素を組み込んだformのパラメータとして認識させるためには、
 * setFormValueを使って値をElementInternalsに設定する必要がある。
 */
class CustomFavoritesLanguage extends HTMLElement {
  static formAssociated = true

  constructor() {
    super()
    const template = document.getElementById('custom-favorites-language')
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.appendChild(template.cloneNode(true).content)

    // プロパティにElementInternalsを設定する。
    this.internals_ = this.attachInternals()
    this.#updateValue(this.#selectElement().value)
  }  

  #updateValue(newValue) {
    this.internals_.setFormValue(newValue)
  }

  #selectElement() {
    return this.shadowRoot.querySelector('select')
  }

  connectedCallback() {
    this.#selectElement().addEventListener('change', event => {
      this.#updateValue(this.#selectElement().value)
    })
  }

  // [Symbol.iterator]を実装してもCustomElementsで選択された値を
  // form.entries()でイテレートされている時の値として返すことはできない。
  // *[Symbol.iterator]() {
  //   const select = this.shadowRoot.querySelector('select')
  //   const [name, value] = [
  //     this.getAttribute('name'),
  //     select.value
  //   ]
  //   yield* [name, value]
  // }
}

const clickListeners = {
  onSampleDummySubmit: event => {
    event.preventDefault()
    const form = document.getElementById('sample-form')
    const output = document.querySelector('.attach-internals-sample .output')

    const sampleCustomSelect = document.getElementById('sample-form-select')
    // カスタム要素がformに追加できていることの確認
    // CustomElementsのクラスにformAssociated=trueがないと
    // formを参照した際にNotSupportedErrorとなる。
    const formElement = sampleCustomSelect.internals_.form
    output.textContent = formElement.id

    const formData = new FormData(formElement)
    const formIterator = formData.entries()
    const entries = Object.fromEntries(formIterator)
    console.log(entries)

    // formIteratorはもうイテレートできないので再度entriesを呼ぶ必要がある。
    for (const [name, value] of formData.entries()) {
      output.innerHTML += `<br />${name}:${value}`
    }    
  }
}

const addListener = () => {
  document.body.addEventListener('click', event => {
    const { eventListener } = event.target.dataset
    const listener = clickListeners[eventListener]
    if (typeof listener === 'function') {
      event.stopPropagation()
      listener(event)
    }
  })
}

const init = () => {
  customElements.define('my-autocomplete-form', MyAutoCompleteForm);
  customElements.define('custom-message', CustomMessage);
  customElements.define('custom-profile', CustomProfile);
  customElements.define('custom-favorites-language', CustomFavoritesLanguage)

  const query = 'sample-declarative-element';
  console.log(getTemplateInnerHTMLList({ query }));
  console.log(getTemplateInnerHTMLList({ query, includeShadowRoots: false }));
  customElements.define(query, SampleDeclarativeElement);

  addListener()
};

init();

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

const getTemplateInnerHTMLList = ({ query, includeShadowRoots = true }) => {
  const templates = Array.from(document.querySelectorAll(query));
  return templates.map(t => t.getInnerHTML({ includeShadowRoots }));
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

const init = () => {
  customElements.define('my-autocomplete-form', MyAutoCompleteForm);
  customElements.define('custom-message', CustomMessage);
  customElements.define('custom-profile', CustomProfile);

  const query = 'sample-declarative-element';
  console.log(getTemplateInnerHTMLList({ query }));
  console.log(getTemplateInnerHTMLList({ query, includeShadowRoots: false }));
  customElements.define(query, SampleDeclarativeElement);
};

init();

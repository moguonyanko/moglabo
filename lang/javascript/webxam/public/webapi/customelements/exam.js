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

  if (this.shadowRoot) {
      // openすると既存のShadowRootが失われてしまう。結果として何も表示されなくなる。
      //this.attachShadow({mode: 'open'});
      this.shadowRoot.addEventListener('click', () => {
        // ShadowRootを明示的に宣言した場合templateを取得する方法はない？
        //const template =  this.shadowRoot.querySelector('template');
        //const shadowRootAttr = template.getAttribute('shadowroot');
        const shadowRootAttr =  this.shadowRoot.mode;
        const value = `${this.id}, shadowroot=${shadowRootAttr}`;
        alert(value);
      });
    } else {
      console.info(`要素#${this.id}は明示的に宣言されていない`);
    }
  }
}

const init = () => {
  customElements.define('my-autocomplete-form', MyAutoCompleteForm);
  customElements.define('custom-message', CustomMessage);

  const query = 'sample-declarative-element';
  console.log(getTemplateInnerHTMLList({ query }));
  console.log(getTemplateInnerHTMLList({ query, includeShadowRoots: false }));
  customElements.define(query, SampleDeclarativeElement);
};

init();

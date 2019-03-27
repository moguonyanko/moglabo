const createRandomString = async () => {
  const response = await fetch('/webcise/RandomString');
  if (!response.ok) {
    throw new Error('Cannot get random string');
  }
  const json = await response.json();
  return json.value;
};

class PublicKeyCreator extends HTMLFormElement {
  static #CREATOR_CLASS = 'create-publickey';
  
  #formString = `<label>name<input class="user-name" type="text" value="taro@example.com" /></label>
<label>display name<input class="user-display-name" type="text" value="Taro" /></label>
    <button type="button" class="${PublicKeyCreator.#CREATOR_CLASS}">Create</button>`;
  
  #createCredencial = async () => {
    const serverRandomValue = await createRandomString();
    // userのidをどのように生成するのが好ましいのかが分かっていない。
    const userRandomValue = await createRandomString();
    
    const publicKey = {
      challenge: Uint8Array.from(serverRandomValue, c => c.charCodeAt(0)),
      rp: {
        name: "My WebAutn Example",
        id: location.host // idが現在のページのドメインに含まれていなければDOMExceptionになる。
      },
      user: {
        id: Uint8Array.from(userRandomValue, c => c.charCodeAt(0)),
        name: this.querySelector('.user-name').value,
        displayName: this.querySelector('.user-display-name').value
      },
      pubKeyCredParams: [{
          alg: -7, // ECDSA w/ SHA-256
          type: "public-key"
        }],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        //authenticatorAttachment: "cross-platform",
      },
      timeout: 60000,
      attestation: "direct"    
    };
    
    return await navigator.credentials.create({ publicKey });
  };
  
  constructor() {
    super();
    
    this.innerHTML = this.#formString.trim();
    // templateを経由することで文字列をHTML要素(content)に変換できる。
    //const t = document.createElement('template');
    //t.innerHTML = this.#formString.trim(); 
    //this.appendChild(t.content);
  }
  
  connectedCallback() {
    this.addEventListener('submit', event => {
      event.preventDefault();
    }, { passive: false });
    
    this.addEventListener('pointerup', async event => {
      if (event.target.classList.contains(PublicKeyCreator.#CREATOR_CLASS)) {
        event.stopPropagation();
        
        try {
          const credencial = await this.#createCredencial();
          console.log(credencial);
        } catch(err) {
          console.error(err);
        }
      }
    });
  }
}

const init = () => {
  customElements.define("pubkey-creator", PublicKeyCreator, { extends: "form" });
};

window.addEventListener('DOMContentLoaded', init);

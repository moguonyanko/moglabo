/**
 * @fileoverview WebAuthn調査用スクリプト
 */

const defaultTimeout = 10000;

const getChallenge = async () => {
  const response = await fetch('/webxam/service/randomnumber');
  if (!response.ok) {
    throw new Error(`Cannot create challenge: ${response.status}`);
  }
  return await response.json();
};

/**
 * テスト用のユーザーIDをランダムな文字列として生成する。
 */
const createUserId = async () => {
  const response = await fetch('/webxam/service/randomstring?linelimit=1');
  if (!response.ok) {
    throw new Error(`Cannot create user id: ${response.status}`);
  }
  return await response.text();
};

const createCredentialArgs = async ({ authenticatorAttachment, extensions }) => {
  const args = {
    publicKey: {
      rp: {
        name: 'My Auth Sample App'
        // idは適当な値を指定するとエラーになる。
        //,id: 'sample.com'
      },
      user: {
        id: Uint8Array.from(await createUserId(), c => c.charCodeAt(0)),
        name: 'sampleuser@example.org',
        displayName: 'Sample User'
      },
      pubKeyCredParams: [{
        type: 'public-key',
        alg: -7
      }],
      attestation: 'direct',
      authenticatorSelection: { authenticatorAttachment },
      timeout: defaultTimeout,
      challenge: new Uint8Array(await getChallenge()).buffer,
      extensions
    }
  };
  return args;
};

const getCredentialArgs = async allowCredentials => {
  const args = {
    publicKey: {
      timeout: defaultTimeout,
      allowCredentials,
      challenge: new Uint8Array(await getChallenge()).buffer
    }
  };
  return args;
};

const getCredential = async rawId => {
  const allowCredentials = [{
    id: rawId,
    transports: ['usb', 'nfc', 'ble'],
    type: 'public-key'
  }];
  const getArgs = await getCredentialArgs(allowCredentials);
  return navigator.credentials.get(getArgs);
};

const createCredential = async ({ authenticatorAttachment, extensions }) => {
  const createArgs =
    await createCredentialArgs({ authenticatorAttachment, extensions });
  return await navigator.credentials.create(createArgs);
};

// DOM

const getAttachment = el => {
  return Array.from(el.querySelectorAll(`input[name='attachment']`))
    .filter(el => el.checked)[0].value;
};

// TODO: 
// rawIdを保持している。idからrawIdを得る方法が分かればidを保持するようにしたい。
let lastCredentialId;

const listeners = {
  async executeAuth(el) {
    const o = el.querySelector('.output');
    try {
      const args = {
        authenticatorAttachment: getAttachment(el),
        extensions: {
          loc: true,
          uvi: true
        }
      };
      const cred = await createCredential(args);
      console.log(cred);
      lastCredentialId = cred.rawId;
      o.innerHTML = `${cred.id}<br />`;
    } catch (err) {
      o.innerHTML = `<span class="error">${err.message}</span><br />`;
    }
  },
  clearOutput(el) {
    el.querySelector('.output').innerHTML = '';
  },
  async getLastClientData(el) {
    const o = el.querySelector('.output');
    try {
      //const targetId = el.querySelector('.credentialid').value;
      const cred = await getCredential(lastCredentialId);
      const data = new TextDecoder('UTF-8').decode(cred.response.clientDataJSON);
      const json = JSON.parse(data);
      o.innerHTML = `${JSON.stringify(json)}<br />`;
    } catch (err) {
      o.innerHTML = `<span class="error">${err.message}</span><br />`;
    }
  },
  async checkEnableAuthByPlatform() {
    // eslint-disable-next-line no-undef
    if (await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()) {
      alert('プラットフォームによる認証可能');
    } else {
      alert('プラットフォームによる認証不可能');
    }
  }
};

window.addEventListener('DOMContentLoaded', async () => {
  document.querySelectorAll('.example').forEach(el => {
    el.addEventListener('pointerup', async event => {
      const et = event.target.dataset.eventTarget;
      if (!et || typeof listeners[et] !== 'function') {
        return;
      }
      await listeners[et](el);
    });
  });
});

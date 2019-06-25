/**
 * @fileoverview WebAuthn調査用スクリプト
 */

const defaultTimeout = 10000;

const getChallenge = async target => {
  const url = `/webxam/service/webauthn/getchallenge?type=${target.toLowerCase()}`;
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-store',
    credentials: 'same-origin'
  });
  if (!response.ok) {
    throw new Error(`Cannot create challenge: ${response.status}`);
  }
  const json = await response.json();
  return json.challenge;
};

/**
 * テスト用のユーザーIDをランダムな文字列として生成する。
 */
// eslint-disable-next-line no-unused-vars
const createUserId = async () => {
  const response = await fetch('/webxam/service/randomstring?linelimit=1');
  if (!response.ok) {
    throw new Error(`Cannot create user id: ${response.status}`);
  }
  return await response.text();
};

const createCredentialArgs = async ({ authenticatorAttachment, extensions }) => {
  const challenge = await getChallenge('register');
  const args = {
    challenge,
    publicKey: {
      rp: {
        name: 'My Auth Sample App'
        // idは適当な値を指定するとエラーになる。
        //,id: 'sample.com'
      },
      user: {
        id: Uint8Array.from('SampleUserId', c => c.charCodeAt(0)),
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
      challenge: new Uint8Array(challenge).buffer,
      extensions
    }
  };
  return args;
};

const getCredentialArgs = async allowCredentials => {
  const challenge = await getChallenge('authentication');
  const args = {
    challenge,
    publicKey: {
      timeout: defaultTimeout,
      allowCredentials,
      challenge: new Uint8Array(challenge).buffer
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
  return {
    credential: await navigator.credentials.get(getArgs),
    challenge: getArgs.challenge
  };
};

const createCredential = async ({ authenticatorAttachment, extensions }) => {
  const createArgs =
    await createCredentialArgs({ authenticatorAttachment, extensions });
  return {
    credential: await navigator.credentials.create(createArgs),
    challenge: createArgs.challenge
  };
};

/**
 * TODO:
 * clientDataJSONしか検証していない。attestationObjectも検証する。
 */
const verifyCredential = async ({ credential, challenge }) => {
  const res = await fetch('/webxam/service/webauthn/verify', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-store',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    body: credential.response.clientDataJSON
  });
  if (!res.ok) {
    throw new Error(`Verify error: ${res.status}`);
  }
  const json = await res.json();
  if (json.status !== 200) {
    throw new Error(`Invalid credential!`);
  }
};

// DOM

const getAttachment = el => {
  return Array.from(el.querySelectorAll(`input[name='attachment']`))
    .filter(el => el.checked)[0].value;
};

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
      const result = await createCredential(args);
      console.log(result);
      verifyCredential(result);
      // TODO: 本来はrawIdではなくidを何らかのストレージに保存するはず。
      lastCredentialId = result.credential.rawId;
      o.innerHTML = `${result.credential.id}<br />`;
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
      const result = await getCredential(lastCredentialId);
      verifyCredential(result);
      const data = new TextDecoder('UTF-8')
        .decode(result.credential.response.clientDataJSON);
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

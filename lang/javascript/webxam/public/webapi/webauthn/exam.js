/**
 * @fileoverview WebAuthn調査用スクリプト
 */

const defaultTimeout = 10000;

const getChallenge = async () => {
  const response = await fetch('/webxam/service/webauthnregister');
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
  const challenge = await getChallenge();
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
  const data = new TextDecoder('UTF-8').decode(credential.response.clientDataJSON);
  const clientData = JSON.parse(data);
  clientData.challenge = challenge;
  const res = await fetch('/webxam/service/webauthnverify', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-store',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrer: 'no-referrer',
    body: JSON.stringify({ clientData })
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
      // 登録内容の検証
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
      const credential = await getCredential(lastCredentialId);

      // TODO: 認証内容の検証を追加する。

      const data = new TextDecoder('UTF-8').decode(credential.response.clientDataJSON);
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

/**
 * @fileoverview WebAuthn調査用スクリプト
 */

const getChallenge = async () => {
    const response = await fetch('/webxam/service/randomnumber');
    if (!response.ok) {
        throw new Error(`Cannot create challenge: ${response.status}`);
    }
    return await response.json();
};

const createCredentialArgs = async ({ authenticatorAttachment }) => {
    const args = {
        publicKey: {
            // Relying Party (a.k.a. - Service):
            rp: {
                name: 'Acme'
            },
            user: {
                id: new Uint8Array(16),
                name: 'moguonyanko@example.org',
                displayName: 'Moguo Nyanko'
            },
            pubKeyCredParams: [{
                type: 'public-key',
                alg: -7
            }],
            attestation: 'direct',
            authenticatorSelection: { authenticatorAttachment },
            timeout: 20000,
            challenge: new Uint8Array(await getChallenge()).buffer
        }
    };

    return args;
};

const getCredentialArgs = async () => {
    const args = {
        publicKey: {
            timeout: 20000,
            // allowCredentials: [newCredential]
            challenge: new Uint8Array(await getChallenge()).buffer
        }
    };
    return args;
};

const tryAuth = async ({ authenticatorAttachment }) => {
    const createArgs = await createCredentialArgs({ authenticatorAttachment });
    const cred = await navigator.credentials.create(createArgs);
    console.log('新規アカウント作成', cred);
    const idList = [{
        id: cred.rawId,
        transports: ['usb', 'nfc', 'ble'],
        type: 'public-key'
    }];
    const getArgs = await getCredentialArgs();
    // 今回はアカウント情報をそのままコピーして使う。
    getArgs.publicKey.allowCredentials = idList;
    return navigator.credentials.get(getArgs);
};

// DOM

const getAttachment = el => {
    return Array.from(el.querySelectorAll(`input[name='attachment']`))
        .filter(el => el.checked)[0].value;
};

const listeners = {
    async executeAuth(el) {
        const o = el.querySelector('.output');
        try {
            const args = {
                authenticatorAttachment: getAttachment(el)
            };
            const result = await tryAuth(args);
            o.innerHTML += `${result}<br />`;
        } catch (err) {
            o.innerHTML += `<span class="error">${err.message}</span><br />`;
        }
    },
    clearOutput(el) {
        const o = el.querySelector('.output');
        o.innerHTML = '';
    }
};

window.addEventListener('DOMContentLoaded', () => {
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

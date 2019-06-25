/**
 * @fileoverview WebAuthn用Challengeモジュール
 */

/* eslint no-undef: "error" */
/* eslint-env node */

const Challenge = require('../../function/challenge');
const URLs = require('../../function/urls');

const defaultLength = 16;

/**
 * TODO: 
 * 暫定的にグローバルオブジェクトに登録済みアカウント情報を保存している。
 * 本来はセッションやデータベースなどに保存する。
 */
const saveRegisterProperty = ({ challenge, origin }) => {
  global.registeredChallenge = challenge;
  global.registeredOrigin = origin;
  global.registeredType = 'webauthn.create';
};

const saveAuthenticationProperty = ({ challenge, origin }) => {
  global.authenticatedChallenge = challenge;
  global.authenticatedOrigin = origin;
  global.authenticatedType = 'webauthn.get';
};

const saveProperty = {
  register: saveRegisterProperty,
  authentication: saveAuthenticationProperty
};

class GetChallenge {
  constructor() {
    this.contentType = 'application/json';
    this.challenge = new Challenge();
  }

  execute({ request, response }) {
    const urls = new URLs(request.url);
    const length = urls.getParameter('length', defaultLength),
      type = urls.getParameter('type', 'register');

    const challenge = this.challenge.getValue({ length });

    if (!(type in saveProperty)) {
      throw new Error(`${type} is unsupported`);
    }

    const save = saveProperty[type];
    save({ challenge, origin: urls.origin });

    const result = { challenge };
    response.write(JSON.stringify(result));
  }
}

module.exports = GetChallenge;

/**
 * @fileoverview WebAuthn用ユーザー登録モジュール
 */

/* eslint no-undef: "error" */
/* eslint-env node */

const Challenge = require('../function/challenge');
const URLs = require('../function/urls');

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

class WebAuthnRegister {
  constructor() {
    this.contentType = 'application/json';
    this.challenge = new Challenge();
  }

  execute({ request, response }) {
    const urls = new URLs(request.url);
    const length = urls.getParameter('length', defaultLength);
    const challenge = this.challenge.getValue({ length });

    saveRegisterProperty({ challenge, origin: urls.origin });

    const result = { challenge };
    response.write(JSON.stringify(result));
  }
}

module.exports = WebAuthnRegister;

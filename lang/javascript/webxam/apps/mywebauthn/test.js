/**
 * @fileoverview WebAuthnサーバ動作確認用スクリプト
 * 参考:
 * https://www.npmjs.com/package/webauthn
 */

/* eslint-env node */

const Client = require('webauthn/client')

const client = new Client({ pathPrefix: '/webauthn' })

const runTest = async () => {
  await client.register({
    username: 'MYUSER1',
    name: 'Mike',
  })
   
  await client.login({ username: 'MYUSER1' })    
}

Promise.resolve(runTest())

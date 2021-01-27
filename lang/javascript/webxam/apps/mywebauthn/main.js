/**
 * @fileoverview WebAuthn練習用スクリプト
 * 参考:
 * https://www.npmjs.com/package/webauthn
 * TODO:
 * リクエストが失敗してしまう。
 */

/* eslint-env node */

const http2 = require('http2')
const express = require('express')
const bodyParser = require('body-parser');

const WebAuthn = require('webauthn')

const Certs = require('../../function/certs')
const config = require('../../config')
const port = config.port.mywebauthn

const base = '/webxam/webauthn'

const sampleStorage = {}

class LevelAdapter {
  async put(id, value) {
    sampleStorage[id] = value
  }
  
  async get(id) {
    return sampleStorage[id]
  }

  async search(param, options = {
    limit = 1,
    reverse = false
  } = {}) {
    const results = Object.keys(sampleStorage).filter(
      key => key.startsWith(param))

    if (options.reverse) {
      results.reverse()
    }
    
    return results.slice(0, options.limit)
  }

  async delete(id) {
    sampleStorage[id] = null
    delete sampleStorage[id]
  }
}

const webauthn = new WebAuthn({
  origin: `https://localhost:${port}`,
  usernameField: 'username',
  userFields: {
    username: 'username',
    name: 'displayName',
  },
  store: new LevelAdapter(),
  rpName: 'Stranger Labs, Inc.',
  enableLogging: false,
})

const app = express();
app.use('/webauthn', webauthn.initialize())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ type: 'application/json' }))

app.get(`${base}/secret`, webauthn.authenticate(), (req, res) => {
  res.status(200).json({ status: 200, message: 'My Secret Message' })
})

app.post(`${base}/register`, async (req, res) => {
  console.log('Try to register')
  const reg = webauthn.register()
  await reg(req, res)
})

const main = async () => {
  const options = await Certs.getOptions()
  http2.createSecureServer(options, app).listen(port)
  console.info(`My WebAuthn Server Started: ${port}`)
}

Promise.resolve(main())

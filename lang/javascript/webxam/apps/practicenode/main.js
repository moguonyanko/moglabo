/**
 * @fileoverview Node練習用Webアプリケーション
 */

/* eslint-env node */

const http2 = require('http2');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');

const config = require('../../config');
const MyEventLoop = require('./eventloop');
const MyCookie = require('./cookie');

const Certs = require('../../function/certs');
const CreateImage = require('../../function/createimage');
const Inouts = require('../../function/inouts');

const Parser = require('expr-eval-fork').Parser;
const childProcess = require('child_process');
const fs = require('fs');

const forge = require('node-forge');
const { webcrypto } = require('node:crypto');
const subtle = webcrypto.subtle;

const e = require('express');

const app = express();
// signed cookieを使用するにはsecret指定が必須
app.use(cookieParser('secret'));

// POSTリクエストのBODYを解析するために必要
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.json({ type: 'application/csp-report' }));

const port = config.port.practicenode;

const contextName = 'webxam';
const contextRoot = `/${contextName}/apps/`;
const practiceNodeRoot = `${contextRoot}practicenode/`;

const corsCheck = (request, callback) => {
  const origin = request.get('Origin');
  if (config.cors.whitelist.indexOf(origin) >= 0 || !origin) {
    callback(null, {
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'HEAD'],
      allowedHeaders: ['Content-Type']
    });
  } else {
    callback(new Error('Invalid origin'), {
      origin: false
    });
  }
};

app.get(practiceNodeRoot, (request, response) => {
  response.send('Practice Node');
});

app.get(`${practiceNodeRoot}hello`, (request, response) => {
  console.log(`Query: ${request.query}`);
  response.send('Hello Node World');
});

app.get(`${practiceNodeRoot}errortest`, (request, response) => {
  response.status(500).send({
    message: 'ERROR TEST'
  })
});

app.get(`${practiceNodeRoot}eventloop/redos`, (request, response) => {
  const el = new MyEventLoop;
  response.send(el.redos(request));
});

app.get(`${practiceNodeRoot}eventloop/average`, async (request, response) => {
  const el = new MyEventLoop;
  response.send(await el.average(request));
});

app.get(`${practiceNodeRoot}cookie/echo`, async (request, response) => {
  const mc = new MyCookie({ request, response });
  response.send(JSON.stringify(mc.echo()));
});

app.get(`${practiceNodeRoot}cookie/sampleuser`, cors(corsCheck),
  async (request, response) => {
    const mc = new MyCookie({ request, response });
    console.log(mc.echo());
    response.send(JSON.stringify(mc.sampleUser));
  });

app.post(`${practiceNodeRoot}cspreport`, (request, response) => {
  console.log(request.body['csp-report']);
  response.setHeader('Content-Type', 'application/json');
  response.send(JSON.stringify({ status: 200 }));
});

app.get(`${practiceNodeRoot}shorturl`, cors(corsCheck),
  (request, response) => {
    // test[2]=1のようなパラメータは自動的に配列として処理されてしまう。
    // https://expressjs.com/en/api.html#req.query
    const obj = {
      param: request.query
    };
    response.send(JSON.stringify(obj));
  });

app.get(`${practiceNodeRoot}reversestring`, cors(corsCheck),
  (request, response) => {
    const string = request.query.string;
    response.send(JSON.stringify({
      result: string.split('').reverse().join('')
    }));
  });

app.post(`${practiceNodeRoot}verifycode`, cors(corsCheck),
  (request, response) => {
    const code = request.body.code;
    const result = {
      result: !isNaN(parseInt(code))
    };
    response.json(result);
  });

app.get(`${practiceNodeRoot}createimage`, cors(corsCheck),
  async (request, response) => {
    const { format, width, height } = request.query;
    const buffer = await CreateImage.draw({
      format, width, height
    });
    response.setHeader('Content-Type', `image/${format}`);
    response.send(buffer);
  });

const setCacheNoStoreHeader = (response, time) => {
  response.setHeader('Cache-Control', `no-store,max-age=0`);
  // Cache-Control以外を設定した時にキャッシュが無効化されるかどうかのテスト
  response.setHeader('Pragma', 'no-cache');
  response.setHeader('Expires', time);
  response.setHeader('Last-Modified', time);
  response.setHeader('Vary', 'Origin');
  // ETagを除去してブラウザキャッシュの振る舞いを調べる。
  response.removeHeader('ETag');
};

app.get(`${practiceNodeRoot}currenttime`, cors(corsCheck),
  (request, response) => {
    const time = new Date().toUTCString();
    console.log(`Called currenttime`);
    setCacheNoStoreHeader(response, time);
    response.json({
      result: time
    });
  });

app.get(`${practiceNodeRoot}sampleimage`, cors(corsCheck),
  async (request, response) => {
    const time = new Date().toUTCString();
    console.log(`Called sampleimage`);
    setCacheNoStoreHeader(response, time);
    const buffer = await Inouts.readFile('image/testimage.png');
    response.setHeader('Content-Type', 'image/png');
    response.send(buffer);
  });

app.get(`${practiceNodeRoot}meaning`, cors(corsCheck),
  (request, response) => {
    const { keyword } = request.query;
    const target = `https://www.google.com/search?q=${keyword}`;
    response.redirect(target);
  });

app.get(`${practiceNodeRoot}random`, cors(corsCheck),
  (request, response) => {
    response.setHeader('Cache-Control', 'max-age=10,stale-while-revalidate=30');
    response.setHeader('Content-Type', 'application/json');
    const { limit } = request.query;
    response.send({
      value: parseInt(Math.random() * limit)
    });
  })

app.get(`${practiceNodeRoot}imagebuffer`, cors(corsCheck),
  async (request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('Content-Type', 'application/octet-stream');

    const canvas = require('canvas').createCanvas(400, 400);
    const ctx = canvas.getContext('2d');
    ctx.fillRect(100, 100, 200, 200);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    response.send(imageData.data);
  });

/**
 * expr-evalの脆弱性を調査するためのサンプル
 * https://www.npmjs.com/package/expr-eval-fork
 * URLパラメータで与えられた数式とコマンドを評価して結果を返す。
 * 参考:
 * https://github.com/silentmatt/expr-eval/issues/289
 */
app.get(`${practiceNodeRoot}expr-eval-evil`, cors(corsCheck),
  async (request, response) => {
    response.setHeader('Cache-Control', 'no-cache')
    response.setHeader('Content-Type', 'application/json')
    const { expression } = request.query
    const [legal_expr, illegal_expr] = expression.split(';').map(expr => expr.trim())

    // 正しい使い方
    const legal_parser = new Parser()
    const legal_result = legal_parser.evaluate(legal_expr)
    console.log(legal_result)

    // 悪意のある使い方
    const evilFunc = expr => {
      fs.writeFileSync('./apps/practicenode/expr-eval-evil.txt', expr)
      return childProcess.execSync(expr).toString()
    }

    // 実際にParserを介して実行される関数を保持したオブジェクト
    const context = {
      func: evilFunc
    }

    // 悪意のあるコードを別のオブジェクトでラップすることでチェックを回避できる。
    // ラップしない場合はevaluateで実行時エラーになる。
    const contextWrapper = {
      context
    }

    const illegal_parser = new Parser()
    const evil_expr = `context.func("${illegal_expr}");`
    const illegal_result = illegal_parser.evaluate(evil_expr, contextWrapper)
    console.log(illegal_result)

    return response.json({
      legal_result,
      illegal_result
    })
  })

const str_to_bytes = str => {
  // UTF-8エンコードで文字列をバイト列に変換
  const encoder = new TextEncoder()
  return encoder.encode(str)
}

const bytes_to_str = bytes => {
  // バイト列をUTF-8デコードで文字列に変換
  const decoder = new TextDecoder()
  return decoder.decode(bytes)
}

function throw_error_with_forge_aescbc() {
  const key = bytes_to_str(new Uint8Array([34, 74, 12, 214, 126, 234, 101, 147, 13, 32, 244, 185, 45, 217, 142, 33, 213, 116, 63, 179, 84, 23, 138, 187, 134, 130, 234, 54, 48, 66, 20, 152]))
  const initialVector = bytes_to_str(new Uint8Array([62, 133, 213, 219, 194, 200, 76, 142, 202, 16, 12, 237, 163, 147, 65, 93]))

  const cipher = forge.cipher.createCipher('AES-CBC', key) // ここでエラーになる。
  cipher.start({ iv: initialVector })
  cipher.update(forge.util.createBuffer("12345678"))
  cipher.finish()
  const encrypted = cipher.output
  console.log('encrypted = ', encrypted.data)
  console.log('encrypted = ', str_to_bytes(encrypted.data))

  return encrypted
}

/**
 * 参考:
 * https://github.com/digitalbazaar/forge/issues/1116
 */
app.get(`${practiceNodeRoot}forge-cipher-error-with-aescbc`, cors(corsCheck),
  async (request, response) => {
    response.setHeader('Cache-Control', 'no-cache')
    response.setHeader('Content-Type', 'application/json')

    try {
      const encrypted = throw_error_with_forge_aescbc()
      const result = {
        encrypted: str_to_bytes(encrypted.data)
      }
      return response.json(result)
    } catch (err) {
      console.error(err)
      response.status(500)
      return response.json({
        error: err.message
      })
    }
  })

const get_invalid_value_with_forge_aescbc = sourceText => {
  // 32バイトの鍵
  const key = forge.util.createBuffer(new Uint8Array([34, 74, 12, 214, 126, 234, 101, 147, 13, 32, 244, 185, 45, 217, 142, 33, 213, 116, 63, 179, 84, 23, 138, 187, 134, 130, 234, 54, 48, 66, 20, 152]))
  // 16バイトのIV
  const iv = forge.util.createBuffer(new Uint8Array([62, 133, 213, 219, 194, 200, 76, 142, 202, 16, 12, 237, 163, 147, 65, 93]))
  const cipher = forge.cipher.createCipher('AES-CBC', key)
  cipher.start({ iv })
  cipher.update(forge.util.createBuffer(sourceText))
  cipher.finish()
  const encrypted = cipher.output

  return encrypted
}

app.get(`${practiceNodeRoot}forge-cipher-invalid-value-with-aescbc`, cors(corsCheck),
  async (request, response) => {
    response.setHeader('Cache-Control', 'no-cache')
    response.setHeader('Content-Type', 'application/json')

    const { source } = request.query

    try {
      const encrypted = get_invalid_value_with_forge_aescbc(source)
      console.log('encrypted (bytes) = ', encrypted.data)
      console.log('encrypted (length) = ', str_to_bytes(encrypted.data))

      const encryptedBytes = str_to_bytes(encrypted.data)
      const result = {
        encryptedBytes: Array.from(encryptedBytes),
        encryptedBuffer: bytesToBase64(encryptedBytes),
        // AES-CBCなのに16バイトになっていない不正な値になっている。
        encryptedLength: str_to_bytes(encrypted.data).length
      }
      return response.json(result)
    } catch (err) {
      console.error(err)
      response.status(500)
      return response.json({
        error: err.message
      })
    }
  })

// WebCryptoAPIの検証用コード
// Forgeで起きている問題が発生しない。

const bytesToBase64 = bytes => {
  // Uint8ArrayからBufferを作成し、Base64形式で文字列化
  return Buffer.from(bytes).toString('base64')
}

const base64ToUint8Array = base64 => {
  // 1. Bufferを使ってBase64デコードし、Bufferオブジェクトを得る
  const buffer = Buffer.from(base64, 'base64')
  // 2. Bufferの内部メモリを共有してUint8Arrayを作成（効率的）
  return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength)
}

const generateAndExportSecretKey = async name => {
    // 1. CryptoKeyオブジェクトを生成
    const keyObject = await subtle.generateKey(
        {
            name,
            length: 256 // 鍵長を256ビットに指定 (32バイト)
        },
        true, // エクスポート可能 (exportable: true) に設定
        ["encrypt", "decrypt"] // 用途を指定
    )

    // 2. CryptoKeyオブジェクトから生のバイト列 (Uint8Array) を取り出す
    const keyBytes = await subtle.exportKey(
        "raw",
        keyObject
    )

    return new Uint8Array(keyBytes)
}

const webcryptoConfig = {
  name: "AES-CBC"
}

// 秘密鍵は環境変数やKMSで管理する方が好ましい。
let WEBCRYPTOAPI_SECRET_KEY = null

const getInitialVector = () => {
  // このサンプルではAES-CBCを使うので16バイトで固定。
  return webcrypto.getRandomValues(new Uint8Array(16))
}

const encryptWithWebCryptoApi = async sourceText => {
  // 1. 鍵とIVの準備
  // 文字列変換を経由せず、Uint8Array（バイナリ）のまま扱います
  const { name } = webcryptoConfig
  const iv = getInitialVector()

  const dataToEncrypt = str_to_bytes(sourceText);

  // 2. 鍵のインポート
  // 生のバイト列からCryptoKeyオブジェクトを作成します
  const key = await subtle.importKey(
    "raw",
    WEBCRYPTOAPI_SECRET_KEY,
    { name },
    false, // 鍵のエクスポートを許可するか
    ["encrypt"]
  )

  // 3. 暗号化の実行
  // 自動的にPKCS#7パディングが適用されます
  const encryptedBuffer = await subtle.encrypt(
    {
      name,
      iv
    },
    key,
    dataToEncrypt
  )

  const encryptedBytes = new Uint8Array(encryptedBuffer)

  return {encryptedBytes, iv}
}

app.get(`${practiceNodeRoot}webcryptoapi-cipher-with-aescbc`, cors(corsCheck),
  async (request, response) => {
    response.setHeader('Cache-Control', 'no-cache')
    response.setHeader('Content-Type', 'application/json')

    const { source } = request.query

    try {
      const {encryptedBytes, iv} = await encryptWithWebCryptoApi(source)

      console.log('encrypted (bytes) = ', encryptedBytes)
      console.log('encrypted (length) = ', encryptedBytes.length)

      const result = {
        encryptedBytes: Array.from(encryptedBytes),
        encryptedBuffer: bytesToBase64(encryptedBytes),
        encryptedLength: encryptedBytes.length,
        ivBase64: bytesToBase64(iv)
      }
      return response.json(result)
    } catch (err) {
      console.error(err)
      response.status(500)
      return response.json({
        error: err.message
      })
    }
  })

const decryptWithWebCryptoApi = async (encryptedBuffer, iv) => {
  const { name } = webcryptoConfig

  const key = await subtle.importKey(
    "raw",
    WEBCRYPTOAPI_SECRET_KEY,
    { name },
    false,
    ["encrypt", "decrypt"] // 権限に "decrypt" を追加
  )

  // 復号の実行
  const decryptedBuffer = await subtle.decrypt(
    { name, iv }, // 暗号化時と全く同じアルゴリズムとIVを使用
    key,
    encryptedBuffer // 暗号化されたバイト列
  )

  const decryptedBytes = new Uint8Array(decryptedBuffer)
  const originalText = bytes_to_str(decryptedBytes)

  return originalText;
}

app.post(`${practiceNodeRoot}webcryptoapi-decipher-with-aescbc`, cors(corsCheck),
  async (request, response) => {
    response.setHeader('Cache-Control', 'no-cache')
    response.setHeader('Content-Type', 'application/json')

    const {source, ivBase64} = request.body
    const encryptedBuffer = base64ToUint8Array(source)
    const iv = base64ToUint8Array(ivBase64)

    try {
      const decryptedText = await decryptWithWebCryptoApi(encryptedBuffer, iv)
      console.log('Original Text:', decryptedText)

      const result = {
        decryptedText
      }
      return response.json(result)
    } catch (err) {
      console.error(err)
      response.status(500)
      return response.json({
        error: err.message
      })
    }
  })


app.use(`${practiceNodeRoot}public`, express.static(__dirname + `/public`))

const main = async () => {
  Certs.getOptions().then(options => {
    http2.createSecureServer(options, app).listen(port);
    console.info(`My Practice Node Application On Port ${port}`);
  })

  WEBCRYPTOAPI_SECRET_KEY = await generateAndExportSecretKey(webcryptoConfig.name)
}

main().then()

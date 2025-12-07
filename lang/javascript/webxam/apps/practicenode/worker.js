const { parentPort, workerData } = require('worker_threads');
const { webcrypto } = require('node:crypto');
const subtle = webcrypto.subtle;
const { str_to_bytes, bytes_to_str } = require('../../function/codeconv')
const webcryptoConfig = require('./config/webcryptoconfig')

let KEY_CACHE = null;

// Worker内で鍵を一度だけインポートする関数
const getCachedKey = async keyRaw => {
    if (!KEY_CACHE) {
        KEY_CACHE = await subtle.importKey(
            "raw",
            keyRaw,
            { name: webcryptoConfig.name },
            false, // Worker側で鍵のエクスポートは不要なのでfalse
            ["encrypt", "decrypt"]
        )
    }

    return KEY_CACHE
}

const getCryptParam = ({ iv, keyRaw }) => {
    const { name, tagLength } = webcryptoConfig

    const cryptoParams = {
        name,
        iv,
        tagLength
    }

    return cryptoParams
}

exports.encrypt = async ({ source, iv, keyRaw }) => {
    const key = await getCachedKey(keyRaw)
    const cryptoParams = getCryptParam({ iv, keyRaw })

    // メインスレッドから渡されたテキストをバイト列に変換
    const dataToEncrypt = str_to_bytes(source) 
    const encryptedBuffer = await subtle.encrypt(cryptoParams, key, dataToEncrypt)

    // ArrayBufferを転送可能オブジェクトとして返す
    return { encryptedBuffer, iv }
}

exports.decrypt = async ({ source, iv, keyRaw }) => {
    const key = await getCachedKey(keyRaw)
    const cryptoParams = getCryptParam({ iv, keyRaw })

    // sourceは既に暗号化されたUint8Array (ArrayBuffer)
    const decryptedBuffer = await subtle.decrypt(cryptoParams, key, source)
    const decryptedText = bytes_to_str(new Uint8Array(decryptedBuffer))

    return { decryptedText }
}

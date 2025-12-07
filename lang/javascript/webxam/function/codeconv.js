/**
 * エンコードやデコードに関連したユーティリティ関数をまとめたモジュールです。
 */

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

module.exports = {
  str_to_bytes,
  bytes_to_str,
  bytesToBase64,
  base64ToUint8Array
}

/**
 * @fileoverview ECMAScriptのPrototypeに関する調査ページ。
 */

const enableKeyCheck = false

const pollutMerge = (target, source) => {
  // ソースオブジェクトのすべてのプロパティを反復処理します
  for (const key in source) {
    // オブジェクトのプロパティが自身のプロパティであることを確認
    // ただし意図的に__proto__やconstructorを持っているオブジェクトを弾くことはできない。
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key]
      const targetValue = target[key]

      // 1. プロトタイプ汚染のキーチェック
      // 汚染確認時はenableKeyCheckがfalseなのでこのチェックが実施されない。
      if (enableKeyCheck) {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          continue // 実際には、これらのプロパティはスキップする必要があります
        }
      }

      // 2. 値がオブジェクトで、かつターゲットにもキーが存在し、
      // ターゲットの値もオブジェクトであれば、再帰的にマージ
      if (typeof sourceValue === 'object' && sourceValue !== null &&
        typeof targetValue === 'object' && targetValue !== null &&
        !Array.isArray(sourceValue) && !Array.isArray(targetValue)) {

        // 再帰的なマージ
        pollutMerge(targetValue, sourceValue)
      } else {
        // それ以外の場合は、値を上書き
        target[key] = sourceValue
      }
    }
  }
  return target
}

const loadListeners = {
  onPollutedPrototype: () => {
    const output = document.querySelector('.prototype-pollution-sample .output')
    output.textContent = ''
    // 効率の良くないクロージャではあるがサンプルを簡単にするために使用する。
    const dumpPollutionInfo = info => output.textContent += info + '\n'

    const pollutedText = document.getElementById('polluted-text').value
    // ----------------------------------------------------
    // 1. 汚染ペイロードの準備
    // ----------------------------------------------------
    // プロトタイプチェーンのルートにアクセスし、すべてのオブジェクトに存在するプロパティを設定するための入力
    const evilPayload = JSON.parse(`{"__proto__": {"polluted": "${pollutedText}"}}`)

    dumpPollutionInfo("=== 汚染前の状態 ===")

    // 汚染される前に作成されたプレーンなオブジェクト
    const safeObject = {}
    // 出力: undefined
    dumpPollutionInfo(`safeObject.polluted: ${safeObject.polluted}`)

    // ----------------------------------------------------
    // 2. 汚染の実行（脆弱性のある関数の呼び出し）
    // ----------------------------------------------------
    // 脆弱な `merge` 関数を使用して、空のオブジェクトに細工されたペイロードをマージします。
    dumpPollutionInfo("\n--- 脆弱な merge 関数を実行してプロトタイプを汚染 ---")
    try {
      pollutMerge({}, evilPayload)
      dumpPollutionInfo("プロトタイプ汚染が実行されました。")
    } catch (e) {
      dumpPollutionInfo(`エラーが発生しました: ${e.message}`)
    }


    // ----------------------------------------------------
    // 3. 汚染後の影響の確認
    // ----------------------------------------------------
    dumpPollutionInfo("\n=== 汚染後の状態 ===")

    // 3.1. 汚染前に作成されたオブジェクトへの影響
    // `safeObject`には 'polluted' プロパティが直接設定されていませんが、
    // プロトタイプチェーンを通じてアクセスできるようになっています。
    dumpPollutionInfo(`safeObject.polluted: ${safeObject.polluted}`) // 出力: "これはプロトタイプ汚染です！"

    // 3.2. 汚染後に作成されたオブジェクトへの影響
    const newObject = {}
    dumpPollutionInfo(`newObject.polluted: ${newObject.polluted}`) // 出力: "これはプロトタイプ汚染です！"

    // 3.3. 'Object' のプロトタイプにプロパティが追加されたことを確認
    dumpPollutionInfo(`Object.prototype.polluted: ${Object.prototype.polluted}`) // 出力: "これはプロトタイプ汚染です！"

    // ----------------------------------------------------
    // 4. 影響の除去 (後片付け)
    // ----------------------------------------------------
    dumpPollutionInfo("\n--- 後片付け ---")
    delete Object.prototype.polluted
    const cleanedObject = {}
    dumpPollutionInfo(`cleanedObject.polluted: ${cleanedObject.polluted}`) // 出力: undefined
  }
}

const addListeners = () => {
  window.addEventListener('load', () => {
    Object.keys(loadListeners).forEach(key => {
      const listener = loadListeners[key]
      if (typeof listener === 'function') {
        listener()
      }
    })
  })
}

const init = () => {
  addListeners()
}

init()

/**
 * @fileoverview Workerからモジュールとしてロードするテストのためのスクリプト
 * importScriptsする場合はexportをコメントアウトする。
 * importScriptsされると定義されたクラスや関数はインポート先Workerの
 * グローバルスコープに公開される。その結果他にインポートされたスクリプトで
 * 定義されたクラスや関数との衝突が発生する恐れがある。
 */

class MyTime {
  static toDate(time) {
    return new Date(time);
  }
}

export { MyTime };

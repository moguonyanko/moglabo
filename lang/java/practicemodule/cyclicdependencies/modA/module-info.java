/**
 * 循環参照テスト用
 * 参考:
 * http://java.boot.by/ocpjd11-upgrade-guide/ch06s02.html
 */

module modA {
  // requires modB;
  // 循環参照を避けるためインターフェースが定義された方のモジュールを参照する。
  requires modC;
  exports pkg1;
}

/**
 * 循環参照テスト用
 * 参考:
 * http://java.boot.by/ocpjd11-upgrade-guide/ch06s02.html
 */

module modB {
  // requires modA;
  // 循環参照を回避するためにインターフェースが定義されている方のモジュールを参照する。
  requires modC;
  exports pkg2;
}

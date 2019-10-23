/**
 * プロバイダ側モジュール
 */

module provider {
  requires service;
  provides sp1.Greetable with pkg1.Greeter;
  // 実装を含むパッケージをexportsするべきでない。
  //exports pkg1;
}

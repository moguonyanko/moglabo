/**
 * プロバイダ側モジュール
 */

module provider {
  requires service;
  provides sp1.Greetable with pkg1.Greeter;
}

/**
 * プロバイダ側モジュールその２
 * 
 * 参考:
 * http://java.boot.by/ocpjd11-upgrade-guide/ch02s02.html
 */

module modPP {
  // serviceモジュールのパッケージを必要とする。
  requires service;
  // serviceモジュールにあるsp1パッケージのGreetableという
  // サービスを実装したp3パッケージのMyProvicerクラスを提供する。
  // MyProviderは直接参照させる必要が無いのでexportsしない。
  provides sp1.Greetable with p3.MyProvider;
}
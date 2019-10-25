/**
 * モジュールアプリケーションに移行するためのモジュールディスクリプタ
 * 
 * jdepsの結果に従ってモジュール名を記述していく。
 * jdeps --module-path mylogger/mylogger.jar -s myapp/myapp.jar
 */

module app {
  requires java.logging;
  // myloggerはモジュール・アプリケーションではないので自動モジュール名を
  // 指定することになる。
  requires mylogger; 
}

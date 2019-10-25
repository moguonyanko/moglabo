/**
 * jdeps --generate-module-info . mylogger.jar
 * 上記コマンドで自動生成したもの。モジュール名は元のjarファイルに
 * ハイフンが含まれていた場合はピリオドに置換される。
 */

module mylogger {
    requires transitive java.logging;

    exports logging;

}

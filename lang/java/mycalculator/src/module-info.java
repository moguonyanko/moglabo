/**
 * 参考:
 * http://java.boot.by/ocpjd11-upgrade-guide/ch01s02.html
 */

module mod.mylabo.calculator {
    // StreamやBigIntegerなどはjava.baseモジュールに属するのでrequiresで指定しなくても
    // コンパイルできる。
    //requires java.logging;
    
    // クライアント側に不必要にrequiresを指定させないために戻り値などでクライアントに公開する
    // クラスを含むモジュールはrequires transitiveを指定する。
    requires transitive java.logging;
    
    // exportsはモジュール名ではなくパッケージ名を指定する。
    exports pkg.mylabo.calculator;
    // exports先モジュールをtoで限定することもできる。toの右辺のモジュールにはパスが
    // 通っている必要がある。今回はmod.mylabo.workerからこのモジュール自身も参照されている為
    // 循環参照となりIDEで設定エラーになってしまう。
    // 公開先を限定する目的があるとはいえクライアントのモジュール名をサービス提供側が直接参照するのは
    // 特定外部モジュールへの依存関係を強めてしまうので好ましくないようにも思える。
    // 例えばto右辺のモジュール名が変更されたらこのモジュールはビルドできなくなる。
    //exports pkg.mylabo.calculator to mod.mylabo.worker;
    
    // opensもモジュール名ではなくパッケージ名を指定する。アクセスレベルの変更などを許可してしまうので
    // 基本的にopen関係は指定するべきでない。
    opens pkg.mylabo.calculator;
    // exports...to同様opens...toも可能。ただし同じ問題がある。
    //opens pkg.mylabo.calculator to mod.mylabo.worker;
}

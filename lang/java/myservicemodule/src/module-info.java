module myservicemodule {
    exports myservicemodule.tools;
    // toを使うことでより公開先を絞ることができる。ただし公開先のライブラリに
    // パスが通っていないといけない。つまり共参照のような状態になる。
    //exports myservicemodule.tools to myclientmodule;
    // exportsで該当するパッケージが指定されていないとビルド時に警告される。
    provides myservicemodule.tools.Pen with myservicemodule.tools.SamplePen;
    // opensにはパッケージを指定しなければならない。
    // Class.forNameで参照するときなど，クライアント側がパッケージ内の型を
    // 直接参照するのでなければexportsされている必要は無い。
    // opens指定されていないパッケージ内のクラスのprivateメソッドに対し
    // Method.setAccessibleを呼び出すと実行時例外がスローされる。
    // publicメソッドはそれを含むクラスのパッケージがopens指定されていなくても
    // リフレクションを介して呼び出すことができる。
    opens myservicemodule.ref;
}

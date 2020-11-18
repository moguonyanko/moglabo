/**
 * 参考:
 * http://www.journaldev.com/13106/java-9-modules
 * http://www.journaldev.com/13596/javase9-module-basics-part2
 */

module exercise.base {
    requires java.desktop;
    requires java.logging;
    requires java.sql;
    requires java.sql.rowset;
    requires java.json;
    requires java.json.bind;
    requires java.net.http;
    requires java.rmi;
    requires mysql.connector.java;
    requires mongo.java.driver;
    requires checker;
    requires junit;
    requires hamcrest.core;
    requires azure.storage;

    exports exercise.rmi to java.rmi;

    // テストクラスを含むパッケージはexportsやopensで公開しないとJUnitでテストできない。
    // module宣言の前にopenを指定することでもテスト実行できるようになるが、不必要に多くの
    // パッケージをopenすることになってしまう。
    // アスタリスクでまとめてパッケージをまとめて指定することはできない。
    exports test.exercise.lang to junit;
    exports test.exercise.function to junit;
    exports test.exercise.stream to junit;
    exports test.exercise.graphics to junit;
    exports test.exercise.function.util to junit;
    exports test.exercise.rmi to junit;
    exports test.exercise.time to junit;
    exports test.exercise.net to junit;
    exports test.exercise.cloud.azure to junit;
}

/**
 * 参考:
 * http://www.journaldev.com/13106/java-9-modules
 * http://www.journaldev.com/13596/javase9-module-basics-part2
 *
 * テスト対象のパッケージを追加するたびに以下のようなexports文を追加するのが面倒なので
 * module自体をopenとすることにした。
 * exports test.exercise.lang to junit;
 */
open module exercise.base {
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
    exports exercise.rmi to java.rmi;
}

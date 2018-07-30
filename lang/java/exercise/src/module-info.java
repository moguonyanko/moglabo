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
    requires mysql.connector.java;
    requires mongo.java.driver;
    requires checker;

    // exportsの練習
    exports exercise.function.util;
}

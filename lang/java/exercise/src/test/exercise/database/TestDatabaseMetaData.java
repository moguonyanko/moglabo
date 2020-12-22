package test.exercise.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.junit.Test;
import static org.junit.Assert.*;

/**
 * 参考:
 * https://www.tutorialspoint.com/java-databasemetadata-gettables-method-with-example
 * https://www.tutorialspoint.com/java-databasemetadata-getcolumns-method-with-example
 */
public class TestDatabaseMetaData {

    private record ConnectionInfo(String url, String user, String password) {
        private static final String URL = "jdbc:mysql://localhost:3306/test";
        private static final String USER = "sampleuser";
        private static final String PASSWORD = "samplepass";

        private ConnectionInfo() {
            this(URL, USER, PASSWORD);
        }
    }

    private final ConnectionInfo connectionInfo;

    public TestDatabaseMetaData() {
        this.connectionInfo = new ConnectionInfo();
    }

    private Connection getConnection() throws SQLException {
        // recordのメソッドを呼び出す形式にしておいた方が将来の変更に対応しやすいかも。
        return DriverManager.getConnection(
            connectionInfo.url(),
            connectionInfo.user(),
            connectionInfo.password()
        );
    }

    private List<String> getTableNames() throws SQLException {
        var names = new ArrayList<String>();

        try (var con = getConnection()) {
            var meta = con.getMetaData();
            var types = new String[]{"TABLE", "VIEW"};
            // MySQLのJDBCドライバが5.1系でも8系でも以下のコードで結果を得られる。
            var tables = meta.getTables(null, null, "%", types);
            // MysqlのJDBCドライバが8系だと以下のコードではテーブル情報を取得できない。
            //var tables = meta.getTables("", "%", "%", types);
            while (tables.next()) {
                var name = tables.getString("TABLE_NAME");
                names.add(name);
            }
        }

        return names;
    }

    private List<String> getColumnNames(String tableName) throws SQLException {
        var names = new ArrayList<String>();

        try (var con = getConnection()) {
            var meta = con.getMetaData();
            // MySQLのJDBCドライバが5.1系でも8系でも以下のコードで結果を得られる。
            var columns = meta.getColumns(null, null, tableName, null);
            // MysqlのJDBCドライバが8系だと以下のコードではカラム情報を取得できない。
            //var columns = meta.getTables("", "%", tableName, null);
            while (columns.next()) {
                var name = columns.getString("COLUMN_NAME");
                names.add(name);
            }
        }

        return names;
    }

    @Test
    public void テーブル名を取得できる() throws SQLException {
        var names = getTableNames();
        assertFalse(names.isEmpty());
        System.out.println(names);
    }

    @Test
    public void カラム名を取得できる() throws SQLException {
        var tableName = "authors";
        var columnNames = getColumnNames(tableName);
        assertFalse(columnNames.isEmpty());
        System.out.println(columnNames);
    }

}

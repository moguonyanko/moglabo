package test.exercise.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

/**
 * 参考:
 * https://www.tutorialspoint.com/java-databasemetadata-gettables-method-with-example
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
            var types = new String[]{"TABLE"};
            var tables = meta.getTables("", "%", "%", types);
            while (tables.next()) {
                var name = tables.getString("Table_Name");
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

}

package test.exercise.database;

import java.sql.DriverManager;
import java.sql.SQLException;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

/**
 * 参考:
 * https://www.tutorialspoint.com/java-databasemetadata-gettables-method-with-example
 */
public class TestDatabaseMetaData {

    @Test
    public void テーブル名を取得できる() throws SQLException {
        var url = "jdbc:mysql://localhost:3306/test";
        var user = "sampleuser";
        var pass = "samplepass";

        var con = DriverManager.getConnection(url, user, pass);
        var meta = con.getMetaData();
        var tables = meta.getTables(null, null, "%", null);

        while (tables.next()) {
            var name = tables.getString("Table_Name");
            System.out.println(name);
        }
    }

}

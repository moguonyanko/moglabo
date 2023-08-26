package moglabo.practicejava.sql;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class StatementTest {

    private static final String URL = "jdbc:mysql://localhost:3306/test";
    private static final String USER = "sampleuser";
    private static final String PASSWORD = "samplepass";

    private Connection getConnection() throws SQLException {
        return DriverManager.getConnection(
                URL,
                USER,
                PASSWORD
        );
    }

    /**
     * 参考
     * https://blogs.oracle.com/javamagazine/post/java-sql-database-resultset
     */
    @Test
    void カーソルからレコードを更新できる() throws SQLException {
        var preCount = 0;
        var currentCount = 0;
        
        try (var con = getConnection()) {
            var st = con.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE,
                    ResultSet.CONCUR_UPDATABLE);
            var rs = st.executeQuery("SELECT * FROM counters");
            
            while (rs.next()) {
                var id = rs.getInt(1);
                if (id == 1) {
                    preCount = rs.getInt(3);
                    rs.updateInt(3, preCount + 1);
                    rs.updateRow(); // これがないとレコードが更新されない。
                    rs.next();
                    break;
                }
            }
            
            rs.previous();
            currentCount = rs.getInt(3);
        }
        
        assertEquals(preCount + 1, currentCount);
    }

}

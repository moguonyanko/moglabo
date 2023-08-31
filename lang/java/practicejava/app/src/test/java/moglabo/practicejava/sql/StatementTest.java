package moglabo.practicejava.sql;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

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
    
    /**
     * 参考
     * https://blogs.oracle.com/javamagazine/post/quiz-yourself-working-with-preparedstatement-and-sql-null-values-in-java
     */
    @Test
    void PreparedStatementでnullを登録できる() throws SQLException {
        try (var con = getConnection()) {
            var ct1 = con.createStatement();
            ct1.execute("UPDATE TEST.PRODUCTS SET PRICE = 100");
            // autocommit=trueの時に呼び出すと実行時エラーになる。
            // すなわちcommitを手動で呼び出しているアプリケーションのJDBCの設定では
            // automommit=trueにしてはいけないということである。
            //con.commit();
            
            var pt = con.prepareStatement("UPDATE TEST.PRODUCTS SET PRICE = ? "
                    + "WHERE DESCRIPTION IS NULL");
            // null値はsetNullで設定できるがnull値の取得はgetObjectを使う。getNullは存在しない。
            //pt.setNull(1, Types.INTEGER);
            Integer val = null;
            pt.setObject(1, val, Types.INTEGER);
            pt.execute();
            
            var ct2 = con.createStatement();
            var rs = ct2.executeQuery("SELECT * FROM TEST.PRODUCTS");
            while (rs.next()) {
                // getIntでint型カラムにあるnull値を得るとゼロにされてしまう。
                //var price = rs.getInt(3);
                var price = rs.getObject(3);
                assertNull(price);
            }
        }
    }

}

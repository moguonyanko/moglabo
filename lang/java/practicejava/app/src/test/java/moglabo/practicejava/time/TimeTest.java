package moglabo.practicejava.time;

import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class TimeTest {
    
    /**
     * 参考:
     * https://www.baeldung.com/java-datetimeformatter
     * https://www.baeldung.com/java-time-instant-to-java-sql-timestamp
     * 
     * TODO:
     * 実行時例外となる。指定しているパターンがDateTimeFormatterでは無効なのだろうか？
     */
    @Test
    void 文字列からDateTimeFormatterを生成できる() {
        var pattern = "yyyyMMddHHmmss";
        var formatter = DateTimeFormatter.ofPattern(pattern);
        // formatにTimestampは直接渡せない。
        var ts = Timestamp.valueOf("2023-11-24 15:15:55.12345");
        var result = formatter.format(ts.toInstant());
        System.out.println(result);
    }
    
}

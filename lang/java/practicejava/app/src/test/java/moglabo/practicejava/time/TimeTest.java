package moglabo.practicejava.time;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoField;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class TimeTest {
    
    private static final String SAMPLE_PATTERN = "yyyyMMddHHmmss";
    
    private static final Timestamp SAMPLE_TIMESTAMP = 
            Timestamp.valueOf("2023-11-24 15:15:55.12345");
    private static final String SAMPLE_TIMESTAMP_STRING = "20231124151555";
    
    @Test
    void 文字列からSimpleDateFormatを生成できる() {
        var formatter = new SimpleDateFormat(SAMPLE_PATTERN);
        var result = formatter.format(SAMPLE_TIMESTAMP);
        System.out.println(result);
        assertEquals(SAMPLE_TIMESTAMP_STRING, result);
    }
    
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
        var formatter = DateTimeFormatter.ofPattern(SAMPLE_PATTERN);
        // formatにTimestampは直接渡せない。
        var yearOfEra = SAMPLE_TIMESTAMP.toInstant().get(ChronoField.YEAR_OF_ERA);
        var result = formatter.format(yearOfEra);
        System.out.println(result);
        assertEquals(SAMPLE_TIMESTAMP_STRING, result);
    }
    
}

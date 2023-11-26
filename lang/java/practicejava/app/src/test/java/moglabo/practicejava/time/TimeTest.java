package moglabo.practicejava.time;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class TimeTest {
    
    private static final String SAMPLE_DATETIME_PATTERN = "yyyyMMddHHmmss";
    
    /**
     * データベースの日時系のカラムから得た値を想定してTimestampを使っている。
     */
    private static final Timestamp SAMPLE_TIMESTAMP = 
            Timestamp.valueOf("2023-11-24 15:15:55.12345");
    /**
     * SAMPLE_TIMESTAMPから期待される文字列表現
     */
    private static final String SAMPLE_TIMESTAMP_STRING = "20231124151555";
    
    @Test
    void 文字列からSimpleDateFormatを生成できる() {
        var formatter = new SimpleDateFormat(SAMPLE_DATETIME_PATTERN);
        var result = formatter.format(SAMPLE_TIMESTAMP);
        System.out.println(result);
        assertEquals(SAMPLE_TIMESTAMP_STRING, result);
    }
    
    /**
     * 参考:
     * https://www.baeldung.com/java-datetimeformatter
     * https://www.baeldung.com/java-time-instant-to-java-sql-timestamp
     * 
     */
    @Test
    void 文字列からDateTimeFormatterを生成できる() {
        var formatter = DateTimeFormatter.ofPattern(SAMPLE_DATETIME_PATTERN);
        /**
         * formatにTimestampは直接渡せない。またTimestamp.toInstant()の戻り値を渡すと
         * 「UnsupportedTemporalTypeException: Unsupported field: YearOfEra」となる。
         */
        var localDateTime = SAMPLE_TIMESTAMP.toLocalDateTime();
        var result = formatter.format(localDateTime);
        System.out.println(result);
        assertEquals(SAMPLE_TIMESTAMP_STRING, result);
    }
    
}

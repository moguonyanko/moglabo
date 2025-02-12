package test.exercise.text;

import java.text.MessageFormat;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Locale;

import org.junit.Test;
import static org.junit.Assert.*;

/**
 * 参考:
 * https://docs.oracle.com/javase/jp/23/docs/api/java.base/java/text/MessageFormat.html
 * 
 */
public class TestMessageFormat {
    
    @Test
    public void MessageFormatで数字を置換できる() {
        var age = 24;
        var result = MessageFormat.format("I am {0,number,integer} years old.", age);
        assertEquals("I am 24 years old.", result);
    }
    
    @Test
    public void 複数の値で置換できる() {
        var pattern = "今は{1,time}です。私は{0}です。";
        var msg = new MessageFormat(pattern, Locale.JAPAN);
        // LocalTimeを渡すと例外となる。
//        var time = LocalDateTime.of(2025, Month.MARCH, 11, 12, 24).toLocalTime();
        var time = new GregorianCalendar(2053, Calendar.MARCH, 11, 12, 24).getTime();
        var args = new Object[]{"ペン", time};
        var result = msg.format(args);
        assertEquals("今は12:24:00です。私はペンです。", result);
    }
    
}

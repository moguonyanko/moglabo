package test.exercise.lang;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

// privateを指定するとコンパイルエラーになる。
// 同一パッケージ内からはアクセスできてしまう。
record SampleRecordItem(String name, int price) {}

public class TestRecord {

    @Test
    public void canGetFieldFromRecord() {
        var name = "Pen";
        var item = new SampleRecordItem(name, 120);
        var actual = item.name();
        assertThat(actual, is(name));
    }

}

package test.exercise.lang;

import exercise.lang.record.EarthLocation;
import exercise.lang.record.UnknownLocation;
import java.time.LocalDateTime;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

/**
 * 参考:
 * https://dzone.com/articles/a-first-look-at-records-in-java-14
 * https://blogs.oracle.com/javamagazine/records-come-to-java
 */

// 暗黙でfinal宣言されている。拡張しようとするとエラーになる。
// クラス内にネストして宣言することは可能。
record SampleRecordItem(String name, int price) {}

class SampleMember {
    
    private String name;
    private int age;
    
    /**
     * ネストクラスはCheckerのようにエンクロージングクラスのインスタンスを参照しないなら
     * staticにしないとメモリを浪費することになる。
     */
    private class Checker {
        
        boolean isAdult() {
            return age < 20;
        }
        
    }
    
    private static class StaticChecker {
        
        boolean isAdult() {
//            return age < 20;
            throw new UnsupportedOperationException();
        }
        
    }
    
    /**
     * StaticCheckerと同じ。recordを使う方がstatic忘れを回避しやすい。
     */
    private record RecordChecker() {
        boolean isAdult() {
//            return age < 20;
            throw new UnsupportedOperationException();
        }
    }
}

public class TestRecord {

    @Test
    public void callImplicitGetter() {
        var name = "Pen";
        var item = new SampleRecordItem(name, 120);
        var actual = item.name();
        assertThat(actual, is(name));
    }

    @Test
    public void callImplicitToString() {
        var sample = new SampleRecordItem("Hoge", 100);
        var s = sample.toString();
        System.out.println(s);
        assertNotNull(s);
    }

    @Test
    public void compareRecords() {
        var s1 = new SampleRecordItem("Foo", 10);
        var s2 = new SampleRecordItem("Foo", 10);
        // hashCode()をプログラマが自分でオーバーライドして記述しなくても
        // 同じ値のハッシュコードが返される。
        System.out.println(s1.hashCode());
        System.out.println(s2.hashCode());
        assertEquals(s1, s2);
    }

    // クラス内に宣言した場合はprivate指定できる。
    private record MySampleCard(LocalDateTime expiration, String code) {
        private static final float VERSION = 1.1f;

        public MySampleCard {
            if (isExpired(expiration)) {
                System.err.println("Already expired");
            }
            if (code == null || code.isBlank()) {
                throw new IllegalArgumentException("Blank code is illegal");
            }
        }

        static float version() {
            return VERSION;
        }

        boolean isExpired(LocalDateTime target) {
            var now = LocalDateTime.now();
            return now.isAfter(target);
        }

        boolean isExpired() {
            return isExpired(expiration());
        }
    }

    @Test
    public void レコードのstaticメソッドを呼び出せる() {
        assertThat(MySampleCard.version(), is(1.1f));
    }

    @Test
    public void レコードのインスタンスメソッドを呼び出せる() {
        var expiration = LocalDateTime.of(2019, 12, 31, 12, 0);
        var sample = new MySampleCard(expiration, "010101");
        assertTrue(sample.isExpired());
    }

    @Test(expected = IllegalArgumentException.class)
    public void コンパクトコンストラクタで入力値のチェックを行える() {
        var expiration = LocalDateTime.of(2019, 12, 31, 12, 0);
        new MySampleCard(expiration, "      ");
    }

    private record SampleMember(String name, int no){
        SampleMember(String name) {
            this(name, -1);
        }

        @Override
        public int no() {
            System.out.println("Field [no] accessed");
            return no;
        }
    }

    @Test
    public void オルタナティブコンストラクタで初期化できる() {
        var sample = new SampleMember("Mike");
        assertThat(sample.no(), is(-1));
    }
    
//    record MyPoint(int x, int y) { }
//    
//    /**
//     * 参考:
//     * https://www.infoq.com/news/2022/05/java-record-pattern/
//     * 
//     * レコードパターンはJDK19以降から使えるようになる予定である。
//     */
//    @Test 
//    public void レコードでパターンマッチングできる() {
//        Object o = new MyPoint(1, 2);
//        if (o instanceof MyPoint(int x, int y)) {
//            assertEquals(1, x);
//            assertEquals(2, y);
//        }
//    }
    
    @Test
    public void インターフェースを実装したrecordから値を取得できる() {
        var unknownLocation = new UnknownLocation();
        var earthLocation = new EarthLocation(0.0d, 0.0d);
        
        assertNull(unknownLocation.getLongitude());
        assertNull(unknownLocation.getLatitude());
        assertNotNull(earthLocation.getLongitude());
        assertNotNull(earthLocation.getLatitude());
    }
    
}

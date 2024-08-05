package test.exercise.concurrent;

import org.junit.Test;
import static org.junit.Assert.*;

/**
 * 参考
 * https://www.baeldung.com/java-20-scoped-values
 * https://docs.oracle.com/en/java/javase/22/docs/api/java.base/java/lang/ScopedValue.html
 */
public class TestScopedValue {
    
    private record User(String name) {
        // Does nothing
    }
    
    @Test
    public void ScopedValueを生成できる() {
        ScopedValue<User> sampleValue = ScopedValue.newInstance();
        assertNotNull(sampleValue);
    }
    
    private static final ScopedValue<User> SAMPLE_USER1 = ScopedValue.newInstance();

    @Test
    public void ScopedValueに値を設定できる() {
        ScopedValue.runWhere(SAMPLE_USER1, new User("Mike"), () -> {
            assertEquals(SAMPLE_USER1.get(), new User("Mike"));
        });
    }
    
    private static final ScopedValue<User> SAMPLE_USER2 = ScopedValue.newInstance();
        
    @Test
    public void 複数のスレッドがScopedValueから自身の値を取得できる() {
        ScopedValue.runWhere(SAMPLE_USER2, new User("Foo"), () -> {
            assertEquals(SAMPLE_USER2.get(), new User("Foo"));
        });
        ScopedValue.runWhere(SAMPLE_USER2, new User("Bar"), () -> {
            assertEquals(SAMPLE_USER2.get(), new User("Bar"));
        });
    }
}

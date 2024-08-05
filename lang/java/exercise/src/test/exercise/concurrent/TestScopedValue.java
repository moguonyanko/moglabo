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
    
}

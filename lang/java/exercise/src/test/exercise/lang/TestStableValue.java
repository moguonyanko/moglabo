package test.exercise.lang;

import org.junit.Test;
import static org.junit.Assert.*;

/**
 * 参考
 * https://openjdk.org/jeps/502
 */
public class TestStableValue {
    
    @Test
    public void StableValueを生成できる() {
        // 2025/03/06時点ではまだ動作しない。
//        StableValue<String> sv = StableValue.of();
    }
    
}

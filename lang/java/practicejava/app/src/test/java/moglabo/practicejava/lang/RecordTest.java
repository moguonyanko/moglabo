package moglabo.practicejava.lang;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class RecordTest {
    
    private sealed interface Base<T> permits SubA, SubB {
        
        T getValue();
        
    }

    private record SubA(String name) implements Base<String> {

        @Override
        public String getValue() {
            return name;
        }
        
    }
    
    private record SubB(Integer i) implements Base<Integer> {

        @Override
        public Integer getValue() {
            return i;
        }
        
    }
    
    @Test
    void インターフェースを実装したrecordを生成できる() {
        var a = new SubA("Mike");
        var b = new SubB(100);
        
        assertSame("Mike", a.getValue());
        assertSame(100, b.getValue());
    }
    
}

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
    
    private record Member(String name) {
        Member {
            if (name == null || name.isEmpty()) {
                name = "NO NAME";
            }
            // this.name = name; // this.nameはfinalなのでコンパイルエラーになる。
        }

        // 以下のコードは上のコンパクトコンストラクタと同じ意味になる。
//        Member(String name) {
//            if (name == null || name.isEmpty()) {
//                name = "NO NAME";
//            }
//            this.name = name; // こちらではthis.nameに代入しても問題ない。
//        }
    }
    
    @Test
    void コンパクトコンストラクタでインスタンス生成できる() {
        var member = new Member(null);
        assertTrue(member.name.equals("NO NAME"));
    }
    
    private static class SampleMachine {
        private final String id = "ABCDE";
        
        Description createDescription() {
            return new Description(id);
        }
        
        DescriptionWithSelf createDescriptionWithSelf() {
            return new DescriptionWithSelf(this);
        }
        
        // 内部クラスよりrecordを使う方が簡潔に記述できる。
        record Description(String id) {
            String getId() {
                return id;
            }
        }
        
        record DescriptionWithSelf(SampleMachine machine) {
            String getId() {
                return machine.id;
            }
        }
        
//        record Description() {
//            String getId() {
//                return id; // idがstaticでなければコンパイルエラーになる。
//            }
//        }
    }
    
    @Test
    void recordを包含するクラスのフィールドを参照できる() {
        var sm = new SampleMachine();
        assertTrue(sm.createDescription().getId().equals("ABCDE"));
        assertTrue(sm.createDescriptionWithSelf().getId().equals("ABCDE"));
    }
    
    private class Student {
        // ネストされたrecordは暗黙でstaticとなる。
        record Name(String name){}
        class Description {
            private final String desc;
            
            public Description(String desc) {
                this.desc = desc;
            }
            
        }
    }
    
    @Test
    void ネストされたレコードからインスタンス生成できる() {
        var studentName = new Student.Name("Mike");
        var studentDesc = new Student().new Description("Sample");
        
        assertTrue(studentName.name.equals("Mike"));
        assertTrue(studentDesc.desc.equals("Sample"));
    }
    
    /**
     * 参考:
     * https://blogs.oracle.com/javamagazine/post/java-record-canonical-constructor
     */
    private record Score(int value) {
        // 引数を取るコンストラクタが暗黙で定義される。
//        Score(int value) {
//            this.value = value;
//        }
        Score(){
            this(0);
        }
    }
    
    @Test
    void recordのフィールドをコンストラクタで初期化できる() {
        var score = new Score();
        assertTrue(score.value == 0);
    }
    
}

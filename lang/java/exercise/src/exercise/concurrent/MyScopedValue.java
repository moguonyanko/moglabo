package exercise.concurrent;

/**
 * ScopedValueの振る舞いを調べるためのプログラムです。
 */
public class MyScopedValue {
    
    private static final ScopedValue<User> SAMPLE_USER = ScopedValue.newInstance();
    
    private record User(String name) {
        // Does nothing
    }
    
    private static void printMultiUserNames() {
        ScopedValue.runWhere(SAMPLE_USER, new User("Foo"), () -> {
            System.out.println(SAMPLE_USER.get().name);
        });
        ScopedValue.runWhere(SAMPLE_USER, new User("Bar"), () -> {
            System.out.println(SAMPLE_USER.get().name);
        });  
    }
    
    public static void main(String[] args) {
        printMultiUserNames();
    }
    
}

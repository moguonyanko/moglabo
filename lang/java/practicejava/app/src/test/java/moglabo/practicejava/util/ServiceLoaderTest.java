package moglabo.practicejava.util;

import java.util.ServiceLoader;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class ServiceLoaderTest {
    
    private interface IdFactory<T> {
        T getId(String idType);
    }
    
    private static class StrIdFactory implements IdFactory<String> {

        @Override
        public String getId(String idType) {
            return switch (idType) {
                case "one" -> "ONE";
                default -> "ZERO";
            };
        }
        
    }
    
    private static class NumIdFactory implements IdFactory<Integer> {

        @Override
        public Integer getId(String idType) {
            return switch (idType) {
                case "one" -> 1;
                default -> 0;
            };
        }
        
    }
    
    /**
     * 参考
     * https://blogs.oracle.com/javamagazine/post/quiz-yourself-service-types-and-service-providers-in-java-modules
     */
    @Test
    void ServiceLoaderでインスタンス生成できる() {        
        var loader = ServiceLoader.load(IdFactory.class);
        
        assertFalse(loader.findFirst().isEmpty());
        
        for (var factory : loader) {
            var id = factory.getId("one");
            System.out.println(factory.getClass().getCanonicalName());
            System.out.println(id);
        }        
    }
    
}

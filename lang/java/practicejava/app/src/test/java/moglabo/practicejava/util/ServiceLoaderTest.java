package moglabo.practicejava.util;

import java.util.ServiceLoader;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class ServiceLoaderTest {

    /**
     * 参考
     * https://blogs.oracle.com/javamagazine/post/quiz-yourself-service-types-and-service-providers-in-java-modules
     * https://docs.oracle.com/javase/jp/20/docs/api/java.base/java/util/ServiceLoader.html
     * @todo
     * プロバイダクラスのインスタンスが登録されていない。
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

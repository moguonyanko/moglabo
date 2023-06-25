package test.exercise.lang;

import org.junit.Test;
import static org.junit.Assert.*;

public class TestString {

    /**
     * 参考:
     * https://blogs.oracle.com/javamagazine/post/java-quiz-local-instance-variables
     */
    private static class Command {

        private final String url;

        private Command(String url) {
            this.url = url;
        }

        private String execute() {
            // 事故を避けるならローカル変数でフィールドを隠蔽するのは避けるべき。
            var tmp = url.substring(0, url.lastIndexOf("/"));
            return tmp.substring(0, tmp.lastIndexOf("/"));
        }
    }

    @Test
    public void substringで文字列を切り出せる() {
        var url = "https://myhost/webpage/index.html";
        var result = new Command(url).execute();
        assertTrue("https://myhost".equals(result));
    }

}

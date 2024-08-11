package moglabo.practicejava.net;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class MyHttpClientTest {
    
    @Test
    void GETリクエストで結果を取得できる() throws Exception {
        var uri = "http://127.0.0.1:9000/hellogis/";
        var result = MyHttpClient.requestGet(uri);
        assertFalse(result.isEmpty());
    }
    
}

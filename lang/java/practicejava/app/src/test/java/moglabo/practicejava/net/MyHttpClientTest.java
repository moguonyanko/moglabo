package moglabo.practicejava.net;

import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class MyHttpClientTest {
    
    @Test
    void GETリクエストで結果を取得できる() throws Exception {
        var uri = "http://127.0.0.1:9000/hellogis/";
        var result = MyHttpClient.requestGet(uri);
        assertFalse(result.isEmpty());
    }
    
    @Test
    void POSTリクエストで結果を取得できる() throws Exception {
        var uri = "http://127.0.0.1:9000/pointsideofline/";
        ObjectMapper objectMapper = new ObjectMapper();
        var jsonString = """
                         {"point":{"type":"Feature","properties":{},"geometry":{"coordinates":[139.751363304702,35.65771000179585],"type":"Point"}},"line":{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"coordinates":[[139.7551995346509,35.66006748781244],[139.75693265376594,35.65465624195437]],"type":"LineString"}}]}}
                         """;
        Map<String, Object> jsonMap = objectMapper.readValue(jsonString, Map.class);
        var result = MyHttpClient.requestPost(uri, jsonMap);
        assertEquals(result.get("side"), -1);
    }
    
}

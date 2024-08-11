package moglabo.practicejava.net;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

/**
 * JDK8を想定しているため標準APIであるHttpClientを使用していない。
 * 
 */
public class MyHttpClient {
    
    private static final Charset DEFAULT_CHARSET = StandardCharsets.UTF_8;
    
    public static String requestGet(String uri) throws IOException, URISyntaxException {
        URL url = new URI(uri).toURL();
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");

        String responseText;
        try (BufferedReader br = new BufferedReader(new InputStreamReader(
                connection.getInputStream(), DEFAULT_CHARSET))) {
            StringBuilder response = new StringBuilder();
            String responseLine;
            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim());
            }
            responseText = response.toString();
        }

        connection.disconnect();

        return responseText;        
    }
    
}

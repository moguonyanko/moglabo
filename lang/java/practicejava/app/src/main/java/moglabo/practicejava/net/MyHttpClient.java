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
import java.util.Map;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.OutputStream;

/**
 * JDK8を想定しているため標準APIであるHttpClientを使用していない。
 */
public class MyHttpClient {

    private static final Charset DEFAULT_CHARSET = StandardCharsets.UTF_8;

    private static final String DEFAULT_CONTENT_TYPE = "application/json";

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

    public static Map<String, Object> requestPost(String uri, Map<String, Object> body)
            throws IOException, URISyntaxException {
        URL url = new URI(uri).toURL();

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonString;
        try {
            jsonString = objectMapper.writeValueAsString(body);
        } catch (JsonProcessingException jpe) {
            throw new IOException(jpe);
        }

        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", DEFAULT_CONTENT_TYPE + "; "
                + DEFAULT_CHARSET.name());
        connection.setRequestProperty("Accept", DEFAULT_CONTENT_TYPE);
        connection.setDoOutput(true);

        // リクエストボディの書き込み
        try (OutputStream os = connection.getOutputStream()) {
            byte[] input = jsonString.getBytes(DEFAULT_CHARSET);
            os.write(input, 0, input.length);
        }

        Map<String, Object> result;

        // リクエストの実行とレスポンスの読み込み
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(connection.getInputStream(), DEFAULT_CHARSET))) {
            StringBuilder response = new StringBuilder();
            String responseLine;
            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim());
            }
            result = objectMapper.readValue(response.toString(), Map.class);
        }

        connection.disconnect();

        return result;

    }

}

package com.moglabo.practicejavaee;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.Reader;
import java.io.StringReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonNumber;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonReader;
import javax.json.JsonString;
import javax.json.JsonValue;
import com.fasterxml.jackson.databind.ObjectMapper;

public class HttpSample {
    
    private static final Charset DEFAULT_CHARSET = StandardCharsets.UTF_8;

    private static final String DEFAULT_CONTENT_TYPE = "application/json";   
    
    private static String readTextByReader(BufferedReader br) throws IOException {
        StringBuilder response = new StringBuilder();
        String responseLine;
        while ((responseLine = br.readLine()) != null) {
            response.append(responseLine.trim());
        }
        return response.toString();
    }

    public static String requestGet(String uri) throws IOException, URISyntaxException {
        URL url = new URI(uri).toURL();
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");

        String responseText;
        try (BufferedReader br = new BufferedReader(new InputStreamReader(
                connection.getInputStream(), DEFAULT_CHARSET))) {
            responseText = readTextByReader(br);
        }catch (Exception e) {
            //e.printStackTrace(System.err);
            try (BufferedReader br = new BufferedReader(new InputStreamReader(
                connection.getErrorStream(), DEFAULT_CHARSET))) {
                responseText = readTextByReader(br);
            }
        }

        connection.disconnect();

        return responseText;
    }
    
    /**
     * サポートする方が増えるたびに修正する必要が生じる。
     */
    private static String toJsonFromMap(Map<String, Object> body) {
        JsonObjectBuilder builder = Json.createObjectBuilder();     
        
        for (String key : body.keySet()) {
            Object value = body.get(key);
            
            if (value instanceof String) {
                builder.add(key, (String) value);
            } else if (value instanceof Integer) {
                builder.add(key, (Integer) value);
            } else if (value instanceof Boolean) {
                builder.add(key, (Boolean) value);
            } else if (value instanceof Double) {
                builder.add(key, (Double) value);
            } else if (value instanceof Long) {
                builder.add(key, (Long) value);
            } else if (value instanceof Map) {
                builder.add(key, toJsonFromMap((Map<String, Object>) value));
            } else {
                if (value == null) {
                    throw new NullPointerException();
                } else {
                    throw new IllegalArgumentException("Unsupported type: " + 
                            value.getClass().getName());
                }
            }        
        }
        
        
        return builder.build().toString();
    }
    
    private static Map<String, Object> fromJsonReader(Reader reader) {
        Map<String, Object> map = new HashMap<>();
        
        try (JsonReader jsonReader = Json.createReader(reader)) {
            JsonObject jsonObject = jsonReader.readObject();
            
            for (Map.Entry<String, JsonValue> entry : jsonObject.entrySet()) {
                map.put(entry.getKey(), toObjectFromJsonValue(entry.getValue()));
            }
        }

        return map;        
    }

    /**
     * サポートする方が増えるたびに修正する必要が生じる。
     */
    private static Object toObjectFromJsonValue(JsonValue jsonValue) {
        switch (jsonValue.getValueType()) {
            case STRING:
                return ((JsonString) jsonValue).getString();
            case NUMBER:
                JsonNumber jsonNumber = (JsonNumber) jsonValue;
                if (jsonNumber.isIntegral()) {
                    return jsonNumber.longValue(); // 数値が大きくないことが分かっているならintValue()
                } else {
                    return jsonNumber.doubleValue();
                }
            case TRUE:
                return true;
            case FALSE:
                return false;
            case NULL:
                return null;
            case OBJECT:
                Map<String, Object> nestedMap = new HashMap<>();
                JsonObject jsonObject = (JsonObject) jsonValue;
                for (Map.Entry<String, JsonValue> entry : jsonObject.entrySet()) {
                    nestedMap.put(entry.getKey(), toObjectFromJsonValue(entry.getValue()));
                }
                return nestedMap;
            case ARRAY:
                List<Object> list = new ArrayList<>();
                JsonArray jsonArray = (JsonArray) jsonValue;
                for (JsonValue arrayValue : jsonArray) {
                    list.add(toObjectFromJsonValue(arrayValue));
                }
                return list;                
            default:
                throw new IllegalArgumentException("Unexpected JSON value type: " + 
                        jsonValue.getValueType());
        }
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
    
    public static void main(String[] args) throws IOException, URISyntaxException {
        ObjectMapper objectMapper = new ObjectMapper();
        
        String uriForGet = "http://127.0.0.1:9000/hellogis/";
        String resultByGet = requestGet(uriForGet);
        System.out.println(resultByGet);
        System.out.println(objectMapper.readValue(resultByGet, Map.class));
        
        String uriForGetError = "http://127.0.0.1:9000/helloerror/";
        String resultByGetError = requestGet(uriForGetError);
        System.out.println(resultByGetError);
        System.out.println(objectMapper.readValue(resultByGetError, Map.class));
        
        String uriForPost = "http://127.0.0.1:9000/pointsideofline/";
        String jsonString = "{\"point\":{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"coordinates\":[139.751363304702,35.65771000179585],\"type\":\"Point\"}},\"line\":{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"coordinates\":[[139.7551995346509,35.66006748781244],[139.75693265376594,35.65465624195437]],\"type\":\"LineString\"}}]}}";
        Map<String, Object> jsonMap = objectMapper.readValue(jsonString, Map.class);
        //Map<String, Object> jsonMap = fromJsonReader(new StringReader(jsonString));
        Map<String, Object>  resultByPost = requestPost(uriForPost, jsonMap);
        System.out.println(resultByPost.get("side"));
    }
        
}

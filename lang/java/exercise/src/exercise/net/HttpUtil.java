package exercise.net;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.*;
import java.nio.file.Path;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import java.net.http.HttpClient;
import java.net.http.HttpHeaders;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import static java.net.http.HttpClient.Version;
import static java.net.http.HttpResponse.BodyHandlers;
import java.nio.charset.StandardCharsets;
import javax.net.ssl.*;

/**
 * 参考:
 * http://www.journaldev.com/13121/java-9-features-with-examples
 * http://download.java.net/java/jdk9/docs/api/jdk/incubator/http/package-summary.html
 * https://labs.consol.de/development/2017/03/14/getting-started-with-java9-httpclient.html
 * https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Sending_forms_through_JavaScript
 */
public class HttpUtil {

    private static void dumpHeaders(HttpHeaders httpHeaders) {
        Map<String, List<String>> headers = httpHeaders.map();
        headers.keySet()
            .forEach(key -> System.out.println(key + ":" + headers.get(key)));
    }

    private static void dumpRequestHeaders(HttpRequest request) {
        dumpHeaders(request.headers());
    }

    private static void dumpResponseHeaders(HttpResponse<?> response) {
        dumpHeaders(response.headers());
    }

    public static String getContent(URI uri) throws IOException,
        InterruptedException {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder(uri)
            .header("UserAgent", "Java")
            // HTTP/1.1を明示的に指定しないとHTTP/2で接続しようとする。
            // その際にSSLの例外が発生してしまう。(サーバの設定の問題？)
            .version(Version.HTTP_1_1)
            // デフォルトはGETメソッドが使用される。
            .build();

        HttpResponse<String> response = client.send(request,
            BodyHandlers.ofString());

        return response.body();
    }

    public static Path getPath(URI uri, Path filePath)
        throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest req = HttpRequest.newBuilder(uri)
            .version(Version.HTTP_1_1)
            .header("Cache-Control", "max-age=0")
            .GET()
            .build();

        // asFileに指定されたPathにダウンロードされたコンテンツが保存される。
        HttpResponse<Path> res = client.send(req,
            BodyHandlers.ofFile(filePath));

        return res.body();
    }

    // TODO:
    // HttpClientでmultipart/form-dataを送信できるようにする。
    // BodyPublisherを参照するとコンパイルエラーになるため一時的にコメントアウトしている。
    public static int upload(URI uri, Path target)
        throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();

        String boundary = "---------------------------sampleboundary2017";
        String fileName = target.getFileName().toString();
        String contentDisposition =
            "Content-Disposition: form-data; name=\"samplefile\"; filename=\"" + fileName +  "\"";

        HttpRequest req = HttpRequest.newBuilder(uri)
            .version(Version.HTTP_1_1)
//            .POST(BodyPublisher.fromFile(target))
            .header("Content-Type", "multipart/form-data; boundary=" + boundary)
//            .POST(BodyPublisher.fromString(boundary + "¥r¥n"))
//            .POST(BodyPublisher.fromString(contentDisposition + "¥r¥n"))
//            .POST(BodyPublisher.fromString("Content-Type: image/png¥r¥n"))
//            .POST(BodyPublisher.fromString("¥r¥n"))
//            .POST(BodyPublisher.fromByteArray(Files.readAllBytes(target)))
//            .POST(BodyPublisher.fromString("¥r¥n"))
//            .POST(BodyPublisher.fromString(boundary + "¥r¥n"))
            .build();

        HttpResponse<String> res = client.send(req, BodyHandlers.ofString());

        System.out.println(res.body());

        return res.statusCode();
    }

    public static void getContentAsync(URI uri, Consumer<String> callback)
        throws ExecutionException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest req = HttpRequest.newBuilder(uri)
            .version(Version.HTTP_1_1)
            .build();

        CompletableFuture<HttpResponse<String>> f1 =
            client.sendAsync(req, BodyHandlers.ofString());

        Executor executor = CompletableFuture.delayedExecutor(100L,
            TimeUnit.MILLISECONDS);

        CompletableFuture<Void> f2 = f1.thenAcceptAsync(res -> {
            if (res.statusCode() >= 200) {
                callback.accept(res.body());
            } else {
                callback.accept(null);
            }
        }, executor);

        f2.get();
    }

    // テスト用のセキュリティ証明書に対するチェックを無視する設定を行う。
    // 参考:
    // https://stackoverflow.com/questions/6047996/ignore-self-signed-ssl-cert-using-jersey-client
    // https://stackoverflow.com/questions/875467/java-client-certificates-over-https-ssl/876785#876785
    private static SSLContext createIgnoredCheckingContext()
        throws GeneralSecurityException {
        TrustManager[] ignoreManager = new TrustManager[]{
            new X509TrustManager() {
                public X509Certificate[] getAcceptedIssuers() {
                    return null;
                }
                public void checkClientTrusted(X509Certificate[] certificates,
                                               String authType) {
                    // Does nothing
                }
                public void checkServerTrusted(X509Certificate[] certificates,
                                               String authType) {
                    // Does nothing
                }
            }
        };

        SSLContext context = SSLContext.getInstance("TLS");
        context.init(null, ignoreManager, new SecureRandom());
        // ここでcontextやverifierの設定を行うのは不適当に思えるが
        // メソッド呼び出し側にやらせるのも面倒である。
        HttpsURLConnection.setDefaultSSLSocketFactory(context.getSocketFactory());
        HttpsURLConnection.setDefaultHostnameVerifier((hostname, session) -> {
            if (hostname.equals("localhost")) {
                return true;
            } else {
                return HttpsURLConnection.getDefaultHostnameVerifier()
                    .verify(hostname, session);
            }
        });

        return context;
    }

    public static String getContentBySSL(URI uri)
        throws IOException, InterruptedException, GeneralSecurityException {
        HttpClient client = HttpClient.newBuilder()
            .sslContext(createIgnoredCheckingContext())
            .build();

        HttpRequest req = HttpRequest.newBuilder(uri)
            .build();

        HttpResponse<String> res = client.send(req, BodyHandlers.ofString());

        //dumpResponseHeaders(res);
        System.out.println("Used HTTP version: " + res.version());

        return res.body();
    }

    public static String getContentBySSL(URI uri, Map<String, String> headers)
        throws IOException, InterruptedException, GeneralSecurityException {
        var client = HttpClient.newBuilder()
            .sslContext(createIgnoredCheckingContext())
            .build();

        var builder = HttpRequest.newBuilder(uri);
        for (String key : headers.keySet()) {
            builder.setHeader(key, headers.get(key));
        }
        var req = builder.build();

        var res = client.send(req, BodyHandlers.ofString());

        //dumpResponseHeaders(res);
        var status = res.statusCode();
        if (status >= HttpURLConnection.HTTP_BAD_REQUEST) {
            throw new IOException("Failed get file: " + status);
        } else {
            return res.body();
        }
    }

    public static void getContentWhenComplete(URI uri, Consumer<String> callback)
        throws GeneralSecurityException, InterruptedException, ExecutionException {
        HttpClient client = HttpClient.newBuilder()
            .sslContext(createIgnoredCheckingContext())
            .build();

        HttpRequest request = HttpRequest.newBuilder(uri)
            .build();

        CompletableFuture<HttpResponse<String>> future =
            client.sendAsync(request, BodyHandlers.ofString());

        CompletableFuture<HttpResponse<String>> f1 =
            future.whenComplete((response, exception) -> {
            System.out.println("When Complete");
            if (exception == null) {
                callback.accept(response.body());
            } else {
                // レスポンスが型の都合上Stringに限定されてしまうため
                // 例外オブジェクトそのものをクライアントに渡すことができない。
                callback.accept(exception.getMessage());
            }
        });

        // getしなければwhenCompleteは呼び出されない。
        f1.get();
    }

    public static String getContentWithBasicAuth(URI uri, String userName, String password)
        throws IOException, InterruptedException, GeneralSecurityException {
        HttpClient client = HttpClient.newBuilder()
            .sslContext(createIgnoredCheckingContext())
            .authenticator(new Authenticator() {
                @Override
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(userName, password.toCharArray());
                }
            })
            .build();

        HttpRequest req = HttpRequest.newBuilder(uri)
            .build();

        HttpResponse<String> res = client.send(req, BodyHandlers.ofString());

        return res.body();
    }

    private static void dumpAvailableProxies(ProxySelector proxySelector, URI uri) {
        System.out.println(proxySelector.select(uri).stream()
            .map(Proxy::toString)
            .collect(Collectors.joining()));
    }

    public static void getContentViaProxyAsync(URI uri, Consumer<String> callback,
                                               InetSocketAddress address)
        throws ExecutionException, InterruptedException, GeneralSecurityException {
        ProxySelector proxySelector;
        if (address != null) {
            proxySelector = ProxySelector.of(address);
        } else {
            proxySelector = ProxySelector.getDefault();
        }

        dumpAvailableProxies(proxySelector, uri);

        HttpClient client = HttpClient.newBuilder()
            .sslContext(createIgnoredCheckingContext())
            .proxy(proxySelector)
            .build();

        HttpRequest request = HttpRequest.newBuilder(uri)
            .build();

        CompletableFuture<HttpResponse<String>> f1 =
            client.sendAsync(request, BodyHandlers.ofString());

        // クライアントにエラーメッセージを返してもクライアント側では
        // メッセージの内容を解析しない限り成功か失敗かを判断できない。
        // 何らかのフォーマットを用いてステータスコードも一緒に返すべきかもしれない。
        f1.whenComplete((response, exception) -> {
            if (exception == null) {
                callback.accept(response.body());
            } else {
                callback.accept(exception.getMessage());
            }
        });

        f1.get();
    }
    
    /**
     * JDK8を想定している。
     */
    public static String requestToRestApi(URL url, Map<String, String> body)
            throws IOException {
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
//        connection.setRequestMethod("POST");
//        connection.setRequestProperty("Content-Type", "application/json; " + 
//                StandardCharsets.UTF_8.name());
//        connection.setRequestProperty("Accept", "application/json");
//        connection.setDoOutput(true);

//        String jsonInputString = "{  }";
//
//        try (OutputStream os = connection.getOutputStream()) {
//            byte[] input = jsonInputString.getBytes(StandardCharsets.UTF_8);
//            os.write(input, 0, input.length);
//        }

        String responseText;
        try (BufferedReader br = new BufferedReader(new InputStreamReader(
                connection.getInputStream(), StandardCharsets.UTF_8))) {
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

    public static void main(String ...args) {
        String url = "https://localhost/";

        try {
            createIgnoredCheckingContext();

            URI uri = new URI(url);
            // HttpsURLConnectionではHTTPSを指定してもHTTP/2ではなくHTTP/1.1が
            // プロトコルとして使用されてしまう。
            HttpsURLConnection connection =
                (HttpsURLConnection)uri.toURL().openConnection();
            connection.setRequestMethod("GET");
            connection.setDoInput(true);
            try (InputStream in = connection.getInputStream();
                 BufferedReader br = new BufferedReader(new InputStreamReader(in))) {
                for (String line = br.readLine(); line != null; line = br.readLine()) {
                    System.out.println(line);
                }
            }
        } catch (GeneralSecurityException | URISyntaxException | IOException e) {
            e.printStackTrace();
        }
    }

}

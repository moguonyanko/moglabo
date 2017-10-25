package exercise.net;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.Authenticator;
import java.net.PasswordAuthentication;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;
import javax.net.ssl.*;

import jdk.incubator.http.HttpClient;
import jdk.incubator.http.HttpHeaders;
import jdk.incubator.http.HttpRequest;
import jdk.incubator.http.HttpResponse;
import static jdk.incubator.http.HttpClient.Version;
import static jdk.incubator.http.HttpResponse.*;

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
            BodyHandler.asString());

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
            BodyHandler.asFile(filePath));

        return res.body();
    }

    // TODO:
    // HttpClientでmultipart/form-dataを送信できるようにする。
    public static int upload(URI uri, Path target)
        throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();

        String boundary = "---------------------------sampleboundary2017";
        String fileName = target.getFileName().toString();
        String contentDisposition =
            "Content-Disposition: form-data; name=\"samplefile\"; filename=\"" + fileName +  "\"";

        HttpRequest req = HttpRequest.newBuilder(uri)
            .version(Version.HTTP_1_1)
//            .POST(HttpRequest.BodyProcessor.fromFile(target))
            .header("Content-Type", "multipart/form-data; boundary=" + boundary)
            .POST(HttpRequest.BodyProcessor.fromString(boundary + "¥r¥n"))
            .POST(HttpRequest.BodyProcessor.fromString(contentDisposition + "¥r¥n"))
            .POST(HttpRequest.BodyProcessor.fromString("Content-Type: image/png¥r¥n"))
            .POST(HttpRequest.BodyProcessor.fromString("¥r¥n"))
            .POST(HttpRequest.BodyProcessor.fromByteArray(Files.readAllBytes(target)))
            .POST(HttpRequest.BodyProcessor.fromString("¥r¥n"))
            .POST(HttpRequest.BodyProcessor.fromString(boundary + "¥r¥n"))
            .build();

        HttpResponse<String> res = client.send(req, BodyHandler.asString());

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
            client.sendAsync(req, BodyHandler.asString());

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

        HostnameVerifier ignoreVerifier = (hostname, session) -> true;

        SSLContext context = SSLContext.getInstance("TLS");
        context.init(null, ignoreManager, new SecureRandom());
        // ここでcontextやverifierの設定を行うのは不適当に思えるが
        // メソッド呼び出し側にやらせるのも面倒である。
        HttpsURLConnection.setDefaultSSLSocketFactory(context.getSocketFactory());
        HttpsURLConnection.setDefaultHostnameVerifier(ignoreVerifier);

        return context;
    }

    public static String getContentBySSL(URI uri)
        throws IOException, InterruptedException, GeneralSecurityException {
        HttpClient client = HttpClient.newBuilder()
            .sslContext(createIgnoredCheckingContext())
            .build();

        HttpRequest req = HttpRequest.newBuilder(uri)
            .build();

        HttpResponse<String> res = client.send(req, BodyHandler.asString());

        //dumpResponseHeaders(res);
        System.out.println("Used HTTP version: " + res.version());

        return res.body();
    }

    public static void getContentWhenComplete(URI uri, Consumer<String> callback)
        throws GeneralSecurityException, IOException, InterruptedException, ExecutionException {
        HttpClient client = HttpClient.newBuilder()
            .sslContext(createIgnoredCheckingContext())
            .build();

        HttpRequest request = HttpRequest.newBuilder(uri)
            .build();

        CompletableFuture<HttpResponse<String>> future =
            client.sendAsync(request, BodyHandler.asString());

        //Executor executor = CompletableFuture.delayedExecutor(3000, TimeUnit.MILLISECONDS);

        CompletableFuture<HttpResponse<String>> f1 =
            future.whenComplete((response, exception) -> {
            System.out.println("When Complete");
            if (exception != null) {
                callback.accept(response.body());
            } else {
                // レスポンスが型の都合上Stringに限定されてしまうため
                // 例外オブジェクトそのものをクライアントに渡すことができない。
                callback.accept(exception.getMessage());
            }
        });

        // TODO: NullPointerException
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

        HttpResponse<String> res = client.send(req, BodyHandler.asString());

        return res.body();
    }

    public static void main(String[] args) {
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

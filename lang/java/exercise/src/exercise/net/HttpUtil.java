package exercise.net;

import jdk.incubator.http.HttpClient;
import jdk.incubator.http.HttpRequest;
import jdk.incubator.http.HttpResponse;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;

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

    private static void dumpRequestHeaders(HttpRequest request) {
        Map<String, List<String>> headers = request.headers().map();
        headers.keySet()
            .forEach(key -> System.out.println(key + ":" + headers.get(key)));
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
    // HttpClientでmultipart/formdataを送信できるようにする。
    public static int upload(URI uri, Path target)
        throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();

        String boundary = "---------------------------sampleboundary2017";
        String contentDisposition =
            "Content-Disposition: form-data; name=\"samplefile\"; filename=\"star.png\"";

        HttpRequest req = HttpRequest.newBuilder(uri)
            .version(Version.HTTP_1_1)
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

}

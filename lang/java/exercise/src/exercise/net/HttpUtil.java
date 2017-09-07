package exercise.net;

import jdk.incubator.http.HttpClient;
import jdk.incubator.http.HttpRequest;
import jdk.incubator.http.HttpResponse;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

import static jdk.incubator.http.HttpClient.Version;
import static jdk.incubator.http.HttpResponse.BodyHandler;

/**
 * 参考:
 * http://www.journaldev.com/13121/java-9-features-with-examples
 * http://download.java.net/java/jdk9/docs/api/jdk/incubator/http/package-summary.html
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

}

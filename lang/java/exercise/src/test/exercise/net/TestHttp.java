package test.exercise.net;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.junit.Ignore;
import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

import exercise.net.HttpUtil;

public class TestHttp {

    @Test
    public void canGetPage() throws IOException,
        InterruptedException, URISyntaxException {
        String sampleUrl = "http://localhost/";
        URI uri = new URI(sampleUrl);
        String result = HttpUtil.getContent(uri);
        assertFalse(result.isEmpty());
    }

    @Test
    public void canGetPath() throws Exception {
        URI uri = new URI("http://localhost/");
        // filePathの場所にuriのコンテンツがダウンロードされる。
        Path filePath = Paths.get("sample/index.html");
        Path result = HttpUtil.getPath(uri, filePath);
        List<String> content = Files.readAllLines(result);
        assertFalse(content.isEmpty());
        // テストに成功したらダウンロードしたファイルは削除する。
        Files.delete(result);
    }

    @Test
    @Ignore("HttpClientでmultipart/form-dataが送信できるまで保留")
    public void canSaveFileByPOST() throws Exception {
        URI uri = new URI("http://localhost:8080/webcise/Upload");
        // filePathの場所にuriのコンテンツがダウンロードされる。
        Path target = Paths.get("sample/star.png");
        int statusCode = HttpUtil.upload(uri, target);
        assertThat(statusCode, is(200));
    }

    @Test
    public void canGetContentAsync() throws Exception {
        String sampleUrl = "http://localhost/";
        URI uri = new URI(sampleUrl);
        HttpUtil.getContentAsync(uri, result -> {
            assertNotNull(result);
            assertFalse(result.isEmpty());
        });
    }

    @Test
    public void canGetContentBySSL() throws Exception {
        String sampleURL = "https://localhost/";
        URI uri = new URI(sampleURL);
        String result = HttpUtil.getContentBySSL(uri);
        assertFalse(result.isEmpty());
    }

    @Test
    public void canGetContentAsyncWhenComplete() throws Exception {
        String sampleUrl = "https://localhost/";
        URI uri = new URI(sampleUrl);
        HttpUtil.getContentWhenComplete(uri, text -> {
            System.out.println("Finished");
            assertNotNull(text);
            assertFalse(text.isEmpty());
        });
    }

    @Test
    public void requestWithBasicAuth() throws Exception {
        String sampleUrl = "https://localhost/secretsite/";
        URI uri = new URI(sampleUrl);
        String result = HttpUtil.getContentWithBasicAuth(uri, "testuser", "secret");
        assertFalse(result.isEmpty());
    }

    @Test
    public void canGetContentViaProxy() throws Exception {
        URI uri = new URI("https://localhost/");
        InetSocketAddress proxyAddress = null; // Direct
        //InetSocketAddress proxyAddress = new InetSocketAddress("proxyhost", 443);
        HttpUtil.getContentViaProxyAsync(uri, content -> {
            System.out.println("Proxy request end");
            assertNotNull(content);
            assertFalse(content.isEmpty());
        }, proxyAddress);
    }

    /**
     * @throws Exception
     * TODO: Authenticationヘッダの設定
     * 参考
     * https://docs.microsoft.com/ja-jp/rest/api/storageservices/get-file
     */
    @Test
    public void ヘッダを設定してファイル取得できる() throws Exception {
        var uri = new URI("https://localhost/webxam/");
        var headers = Map.of(
            "Date", new Date().toString()
        );
        var result = HttpUtil.getContentBySSL(uri, headers);
        assertFalse(result.isEmpty());
    }
}

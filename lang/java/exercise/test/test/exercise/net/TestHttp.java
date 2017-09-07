package test.exercise.net;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.junit.Test;
import static org.junit.Assert.*;

import exercise.net.HttpUtil;

public class TestHttp {

    @Test
    public void canGetPage() throws IOException,
        InterruptedException, URISyntaxException {
        String sampleUrl = "http://localhost/";
        URI uri = new URI(sampleUrl);
        String result = HttpUtil.getContent(uri);
        //System.out.println(result);
        assertFalse(result.isEmpty());
    }

    @Test
    public void canGetPath() throws Exception {
        URI uri = new URI("http://localhost/");
        // filePathの場所にuriのコンテンツがダウンロードされる。
        Path filePath = Paths.get("sample/index.html");
        Path result = HttpUtil.getPath(uri, filePath);
        List<String> content = Files.readAllLines(result);
        //System.out.println(content);
        assertFalse(content.isEmpty());
        // テストに成功したらダウンロードしたファイルは削除する。
        Files.delete(result);
    }

}

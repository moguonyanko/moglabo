package test.exercise.io;

import java.io.*;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.channels.AsynchronousFileChannel;
import java.nio.channels.FileChannel;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.nio.file.attribute.FileAttribute;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import exercise.io.SampleMember;
import org.junit.Ignore;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

public class TestFileOperation {

    @Test
    public void パス文字列からファイル名を得ることができる() {
        // OSに即したファイルセパレータを使ってパスが記述されていない場合は
        // getFileNameでファイル名のPathを得ることができない。全てのパスを
        // 含むPathが返されてしまう。
        var pathStr = Stream.of("usr", "local", "tmp", "sample.txt")
            .collect(Collectors.joining(File.separator));

        var expected = "sample.txt";

        var path = Paths.get(pathStr);
        var actual = path.getFileName().toString();

        assertThat(actual, is(expected));
    }

    @Test
    public void ファイル名のみの文字列からファイル名を得ることができる() {
        String pathStr = "sample.txt";

        String expected = "sample.txt";

        Path path = Paths.get(pathStr);
        String actual = path.getFileName().toString();

        assertThat(actual, is(expected));
    }

    @Test
    public void ディレクトリを渡されると最後のディレクトリがファイル名にされる() {
        var pathStr = Stream.of("usr", "local", "tmp")
            .collect(Collectors.joining(File.separator));

        var expected = "tmp";

        var path = Paths.get(pathStr).getFileName();
        var actual = path.toString();

        assertThat(actual, is(expected));
    }

    @Test
    public void 空文字が渡されてもnullにならない() {
        String pathStr = "";
        assertNotNull(Paths.get(pathStr).getFileName());
    }

    @Test
    public void canResolvePath() {
        var path = Paths.get("/usr/local/");
        var actual = path.resolveSibling("var");
        var expected = Paths.get("/usr/var");

        assertThat(actual, is(expected));
    }

    @Test
    public void canCreatePathByRelativize() {
        var p1 = Paths.get("/usr");
        var p2 = Paths.get("/local/src");
        // rootが異なるPathをrelativizeしようとすると例外となる。
        //var p2 = Paths.get("local/src");
        var actual = p1.relativize(p2);
        var expected = Paths.get("../local/src");
        assertThat(actual, is(expected));
    }

    @Test
    public void canCreatePathByPthOf() throws URISyntaxException {
        var p1 = Path.of("/", "usr", "local", "var");
        assertTrue(Files.exists(p1));
        // 少なくともデフォルトの状態ではhttpスキームなどを用いたURIをPath.ofに渡すと
        // FileSystemNotFoundExceptionがスローされる。
        //var uri = new URI("http://localhost/webxam/");
        var uri = URI.create("file:///usr/local/var");
        var p2 = Path.of(uri);
        assertTrue(Files.exists(p2));
    }

    @Test
    public void canReadString() throws IOException {
        var path = Paths.get("sample/foo/bar/baz/filessample.txt");
        // Charsetを指定しない場合はUTF-8
        var content = Files.readString(path, StandardCharsets.UTF_8);
        assertNotNull(content);
    }

    @Test
    public void canWriteString() throws IOException {
        var path = Files.createTempFile("test", ".mytest");
        var resultPath = Files.writeString(path, "HelloJavaNewIO",
            StandardCharsets.UTF_8,
            // OpenOptionを指定しない時は以下を指定したのと同じになる。
            StandardOpenOption.CREATE,
            StandardOpenOption.TRUNCATE_EXISTING,
            StandardOpenOption.WRITE);
        var lines = Files.readAllLines(resultPath, StandardCharsets.UTF_8);
        assertTrue(lines.size() > 0);
    }

    @Test
    public void getLinesFromTextFile() throws Exception {
        Path path = Paths.get("sample/foo/bar/baz/filessample.txt");
        // Files.linesは内部でストリームをcloseしない。
        // closeが行われるコードを呼び出し側で明示的に記述しないと
        // リソースの解放漏れが発生する。
        try (var stream = Files.lines(path)) {
            stream.map(String::toUpperCase).forEach(System.out::println);
        }
    }

    /**
     * 参考：
     * https://www.baeldung.com/java-mapped-byte-buffer
     */
    @Test
    public void MappedByteBufferでファイル読み込みできる() throws IOException {
        CharBuffer charBuffer = null;
        var path = Paths.get("sample/hello.txt");
        try (var channel = (FileChannel) Files.newByteChannel(path,
            StandardOpenOption.READ)) {
            var mappedByteBuffer =
                channel.map(FileChannel.MapMode.READ_ONLY,
                    0, channel.size());

            if (mappedByteBuffer != null) {
                charBuffer = Charset.forName("UTF-8").decode(mappedByteBuffer);
            }
        }
        assertNotNull(charBuffer);
        var expected = "Hello";
        var actual = charBuffer.toString();
        assertThat(actual, is(expected));
    }

    @Test
    public void MappedByteBufferでファイル書き込みできる() throws IOException {
        // マルチバイト文字や改行文字はBufferOverflowExceptionになる。
        var sampleText = "HelloWorld";
        var charBuffer = CharBuffer.wrap(sampleText);
        var path = Paths.get("sample/helloworld.txt");

        try (var channel = (FileChannel) Files.newByteChannel(path,
            StandardOpenOption.READ,
            StandardOpenOption.WRITE,
            StandardOpenOption.TRUNCATE_EXISTING)) {

            var mappedByteBuffer = channel.map(
                FileChannel.MapMode.READ_WRITE,
                0, charBuffer.length()
            );
            if (mappedByteBuffer != null) {
                mappedByteBuffer.put(Charset.forName("UTF-8").encode(charBuffer));
            }
        }

        var actual = String.join("", Files.readAllLines(path));
        assertThat(actual, is(sampleText));
    }

    @Test
    public void MappedByteBufferでオブジェクトを書き出せる() throws IOException {
        var name = "Mike";
        var age = 24;
        var member = new SampleMember(name, age);
        var path = Paths.get("sample/samplemember.obj");
        Files.deleteIfExists(path);
        Files.createFile(path);

        try (var channel = (FileChannel) Files.newByteChannel(path,
            StandardOpenOption.READ,
            StandardOpenOption.WRITE,
            StandardOpenOption.TRUNCATE_EXISTING)) {

            var mappedByteBuffer = channel.map(
                FileChannel.MapMode.READ_WRITE,
                0,
                1024 // オブジェクトから計算せず適当なサイズを指定してしまっている。
            );

            if (mappedByteBuffer != null) {
                member.save(mappedByteBuffer);
            }
        }

        assertTrue(Files.exists(path));
        assertTrue(Files.size(path) > 0);
    }

    @Test
    @Ignore("MappedByteBuffer読み込みは一時的にテスト除外")
    public void MappedByteBufferでオブジェクトを読み込める() throws IOException {
        var path = Paths.get("sample/samplemember.obj");
        SampleMember member = null;

        try (var channel = (FileChannel) Files.newByteChannel(path,
            StandardOpenOption.READ)) {

            var mappedByteBuffer = channel.map(
                FileChannel.MapMode.READ_ONLY,
                0,
                channel.size()
            );

            if (mappedByteBuffer != null) {
                member = SampleMember.load(mappedByteBuffer);
            }
        }

        var expected = new SampleMember("Mike", 24);
        assertThat(member, is(expected));
    }

    /**
     * 参考
     * http://www.java2s.com/Tutorials/Java/Java_io/1050__Java_nio_Asynchronous.htm
     */
    @Test
    public void 非同期でファイルを読み込みできる() throws IOException,
        InterruptedException, ExecutionException {
        var path = Paths.get("sample/hello.txt");
        var originalSize = (int) Files.size(path);
        var buffer = ByteBuffer.allocate(originalSize);

        try (var channel = AsynchronousFileChannel.open(path,
            StandardOpenOption.READ);
             // DataInputをNIOでラップして使えるようにするテスト
             var inputStream = new ByteArrayInputStream(buffer.array());
             var dataInput = new DataInputStream(inputStream)
        ) {
            var future = channel.read(buffer, 0);
            var resultSize = future.get();
            assertEquals(originalSize, resultSize.intValue());

            var charset = StandardCharsets.UTF_8;
            var data = new String(dataInput.readAllBytes(), charset);
            System.out.println("AsynchronousFileChannel read -> " + data);
        }
    }

    @Test
    public void ランダムアクセスでファイルを読むことができる() throws IOException {
        Path path = Paths.get("sample/helloworld.txt");
        var size = (int)Files.size(path);
        try (var rf = new RandomAccessFile(path.toFile(), "r");
            var channel = rf.getChannel()) {
            var buffer = ByteBuffer.allocate(size);

            channel.read(buffer);
            assertEquals(channel.size(), size);

            var charset = StandardCharsets.UTF_8;
            var data = new String(buffer.array(), charset);
            buffer.clear();

            System.out.println("RandomAccessFile read -> " + data);
        }
    }

}

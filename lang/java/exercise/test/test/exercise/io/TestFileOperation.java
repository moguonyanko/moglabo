package test.exercise.io;

import java.io.File;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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

}

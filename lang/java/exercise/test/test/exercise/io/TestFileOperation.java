package test.exercise.io;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

public class TestFileOperation {
	
	@Test
	public void パス文字列からファイル名を得ることができる() {
		String pathStr = "C:\\Users\\anonymous\\temp\\sample.txt";
		
		String expected = "sample.txt";
		
		Path path = Paths.get(pathStr);
		String actual = path.getFileName().toString();
		
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
		String pathStr = "C:\\Users\\anonymous\\temp\\";
		
		String expected = "temp";
		
		Path path = Paths.get(pathStr).getFileName();
		String actual = path.toString();
		
		assertThat(actual, is(expected));
	}

	@Test
	public void 空文字が渡されてもnullにならない() {
		String pathStr = "";
		assertNotNull(Paths.get(pathStr).getFileName());
	}

}

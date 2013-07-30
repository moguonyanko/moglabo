package exercise.io;

import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.nio.file.PathMatcher;
import java.nio.file.Paths;

public class PathMatcherPractice {

	public static void main(String[] args) {

		String glob = "glob:*.{txt,csv}";
		PathMatcher matcher = FileSystems.getDefault().getPathMatcher(glob);

		Path target = Paths.get("../../../sample/memo.txt");

		if (matcher.matches(target)) {
			System.out.println(target);
		}

	}
}

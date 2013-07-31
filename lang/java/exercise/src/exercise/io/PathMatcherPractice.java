package exercise.io;

import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.PathMatcher;
import java.nio.file.Paths;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class PathMatcherPractice {

	public static void main(String[] args) {

		Path target = Paths.get("../../../sample/");
		String glob = "glob:*.{txt,csv}";
		PathFinder finder = new PathFinder(glob);
		try {
			Files.walkFileTree(target, finder);
		} catch (IOException ex) {
			Logger.getLogger(PathMatcherPractice.class.getName()).log(Level.SEVERE, null, ex);
		}
		System.out.println(finder.getFoundPathCount());
		finder.dump();
	}
}

class PathFinder extends SimpleFileVisitor<Path> {

	private final PathMatcher matcher;
	private final List<Path> foundPaths = new ArrayList<>();

	PathFinder(String glob) {
		this.matcher = FileSystems.getDefault().getPathMatcher(glob);
	}

	private void find(Path path) {
		Path pathName = path.getFileName();
		if (pathName != null && matcher.matches(pathName)) {
			foundPaths.add(path);
		}
	}

	int getFoundPathCount() {
		return foundPaths.size();
	}
	
	void dump(){
		for (Path path : foundPaths){
			//System.out.println(path.getFileName());
			System.out.println(path);
		}
	}

	@Override
	public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) throws IOException {
		find(dir);
		return FileVisitResult.CONTINUE;
	}

	@Override
	public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
		find(file);
		return FileVisitResult.CONTINUE;
	}

	@Override
	public FileVisitResult visitFileFailed(Path file, IOException exc) throws IOException {
		System.err.println("Path cannot visit : " + file);
		return FileVisitResult.CONTINUE;
	}
}

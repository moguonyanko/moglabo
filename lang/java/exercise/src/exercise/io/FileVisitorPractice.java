package exercise.io;

import java.io.IOException;
import java.nio.file.FileSystemLoopException;
import java.nio.file.FileVisitOption;
import java.nio.file.FileVisitResult;
import java.nio.file.FileVisitor;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.nio.file.attribute.PosixFileAttributes;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.EnumSet;
import java.util.logging.Level;
import java.util.logging.Logger;

public class FileVisitorPractice {

	public static void main(String[] args) {
		Path path = Paths.get("../../../sample/testdir");
		EnumSet<FileVisitOption> options = EnumSet.of(FileVisitOption.FOLLOW_LINKS);
		FileVisitor visitor = new AttrViewVisiter();
		int depth = Integer.MAX_VALUE;

		try {
			//Files.walkFileTree(path, options, depth, visitor);
			Files.walkFileTree(path, visitor);
		} catch (IOException ex) {
			Logger.getLogger(FileVisitorPractice.class.getName()).log(Level.SEVERE, null, ex);
		}
	}
}

class AttrViewVisiter implements FileVisitor<Path> {

	@Override
	public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {

		if (attrs.isSymbolicLink()) {
			System.out.println(file + " is SymbolicLink.");
		} else if (attrs.isRegularFile()) {
			System.out.println(file + " is RegularFile.");
			byte[] bytes = Files.readAllBytes(file);
		} else if (attrs.isDirectory()) {
			System.out.println(file + " is Direcotory.");
		} else {
			System.out.println(file + " is Other.");
		}

		System.out.println("File size is " + attrs.size());

		PosixFileAttributes _attrs = Files.readAttributes(file, PosixFileAttributes.class);

		//if (attrs instanceof PosixFileAttributes) {
		//	PosixFileAttributes _attrs = (PosixFileAttributes) attrs;
		System.out.format("%s %s %s%n",
			_attrs.owner().getName(),
			_attrs.group().getName(),
			PosixFilePermissions.toString(_attrs.permissions()));
		//}

		return FileVisitResult.CONTINUE;
	}

	@Override
	public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) throws IOException {
		System.out.println("Start visit to " + dir);
		return FileVisitResult.CONTINUE;
	}

	@Override
	public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
		//if (exc != null) {
		System.out.println("Finish visit at " + dir + ", error infomation is " + exc);
		return FileVisitResult.CONTINUE;
		//} else {
		//	System.err.println("Error occured! " + exc);
		//	return FileVisitResult.SKIP_SIBLINGS;
		//}
	}

	@Override
	public FileVisitResult visitFileFailed(Path file, IOException exc) throws IOException {
		if (exc instanceof FileSystemLoopException) {
			//Logger.getLogger(FileVisitorPractice.class.getName()).log(Level.SEVERE, null, exc);
			//System.err.println("Loop structure detected : " + exc);
			//return FileVisitResult.TERMINATE;
			throw exc;
		}

		return FileVisitResult.CONTINUE;
	}
}

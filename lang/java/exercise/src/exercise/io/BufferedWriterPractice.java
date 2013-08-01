package exercise.io;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.logging.Level;
import java.util.logging.Logger;

public class BufferedWriterPractice {

	public static void main(String[] args) {

		String path = "../../../sample/output.txt";
		String message = "TEST MESSAGE";
		//writeTest1(path, message);
		//writeTest2(path, message);
		writeTest3(path, message);
		

	}

	private static void writeTest1(String pathName, String message) {
		Path path = Paths.get(pathName);
		File file = path.toAbsolutePath().toFile();

		try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
			writer.write(message);
		} catch (IOException ex) {
			Logger.getLogger(BufferedWriterPractice.class.getName()).log(Level.SEVERE, null, ex);
		}
	}

	private static void writeTest2(String pathName, String message) {

		try {
			//File file = new File(pathName);
			//System.out.println(file);
			File canonicalFile = new File(pathName).getCanonicalFile();
			System.out.println(canonicalFile);

			try (BufferedWriter writer = new BufferedWriter(new FileWriter(canonicalFile))) {
				writer.write(message);
			}

		} catch (IOException ex) {
			Logger.getLogger(BufferedWriterPractice.class.getName()).log(Level.SEVERE, null, ex);
		}
	}

	private static void writeTest3(String pathName, String message) {
		Path path;
		try {
			path = Paths.get(pathName).toRealPath(LinkOption.NOFOLLOW_LINKS);
			File file = path.toFile();

			try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
				writer.write(message);
			}

		} catch (IOException ex) {
			Logger.getLogger(BufferedWriterPractice.class.getName()).log(Level.SEVERE, null, ex);
		}
	}
}

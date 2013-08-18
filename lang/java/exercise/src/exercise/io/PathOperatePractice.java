package exercise.io;

import java.nio.file.Path;
import java.nio.file.Paths;

public class PathOperatePractice {

	/**
	 * @param args the command line arguments
	 */
	public static void main(String[] args) {
		
		Path path1 = Paths.get("/home/hoge/bar/../../memo.txt");
		
		Path normalPath1 = path1.normalize();
		int path1Count = path1.getNameCount();
		
		System.out.println(normalPath1);
		System.out.println(path1Count);
		
	}
}

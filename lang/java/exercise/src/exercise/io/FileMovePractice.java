package exercise.io;

import java.io.IOException;
import java.nio.file.CopyOption;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.logging.Level;
import java.util.logging.Logger;

import static java.nio.file.StandardCopyOption.*;

public class FileMovePractice{

	/**
	 * @param args the command line arguments
	 */
	public static void main(String[] args){
		
		String fromPath = "../../../sample/testdir3";
		Path from = Paths.get(fromPath);
		//String toPath = "../../../sample/testdir/test|dir4"; /* InvalidPathException on Windows7(x86) */
		String toPath = "../../../sample/testdir/testdir4-1";
		Path to = Paths.get(toPath);

		try{

			CopyOption[] options = new CopyOption[]{REPLACE_EXISTING, ATOMIC_MOVE};
			Path result = Files.move(from, to, options);
		}catch(IOException ex){
			Logger.getLogger(FileCopyPractice.class.getName()).log(Level.SEVERE, null, ex);
		}		
		
		
	}
}

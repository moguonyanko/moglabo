package exercise.io;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.logging.Level;
import java.util.logging.Logger;

public class FileDeletePractice{
	
	public static void main(String[] args){
		
		Path target = Paths.get("../../../sample/testdir2");
		try{
			//Files.deleteIfExists(target);
			Files.delete(target);
		}catch(NoSuchFileException ex){
			Logger.getLogger(FileDeletePractice.class.getName()).log(Level.SEVERE, null, ex);
		}catch(IOException ex){
			Logger.getLogger(FileDeletePractice.class.getName()).log(Level.SEVERE, null, ex);
		}
		
	}
	
}

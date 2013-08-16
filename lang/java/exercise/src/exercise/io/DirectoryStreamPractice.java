package exercise.io;

import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.logging.Level;
import java.util.logging.Logger;

public class DirectoryStreamPractice {

	public static void main(String[] args) {
		
		String path = "../../../sample/";
		Path target = Paths.get(path);
		String glob = "*.png";
		//String glob = "*.{txt,sh}";
		
		try {
			for(Path nowPath : Files.newDirectoryStream(target, glob)){
			
				StringBuilder sb = new StringBuilder();
				
				sb.append(nowPath.getFileName());
				sb.append(FileSystems.getDefault().getSeparator());
				sb.append(Files.probeContentType(nowPath));
				
				System.out.println(sb.toString());
			
			}
		} catch (IOException ex) {
			Logger.getLogger(DirectoryStreamPractice.class.getName()).log(Level.SEVERE, null, ex);
		}
	}
}

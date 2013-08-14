package exercise.io;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.CopyOption;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.nio.file.attribute.UserDefinedFileAttributeView;

import static java.nio.file.StandardCopyOption.*;

public class FileCopyPractice{

	public static void main(String[] args){

		String fromPath = "../../../sample/testdir";
		//String fromPath = "../../../sample/testdir/memo6.txt";
		Path from = Paths.get(fromPath);
		String toPath = "../../../sample/testdir3";
		//String toPath = "../../../sample/testdir2/memo6-2.txt";
		Path to = Paths.get(toPath);

		try{

			UserDefinedFileAttributeView attrView = Files.getFileAttributeView(from, UserDefinedFileAttributeView.class);
			Charset charset = Charset.defaultCharset();
			System.out.println("default charset is " + charset);
			attrView.write("GREETING", charset.encode("HELLO"));

			CopyOption[] options = new CopyOption[]{REPLACE_EXISTING, COPY_ATTRIBUTES};
			Path result = Files.copy(from, to, options);

			if(Files.isSameFile(to, result)){
				System.out.println("same path");
			}

		}catch(IOException ex){
			Logger.getLogger(FileCopyPractice.class.getName()).log(Level.SEVERE, null, ex);
		}

	}
}

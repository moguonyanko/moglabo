package exercise.lang;

import java.io.IOException;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ExceptionHandlingPractice {

	/**
	 * @param args the command line arguments
	 */
	public static void main(String[] args) {

		try {
			errorTest();
		} catch (IOException | ClassNotFoundException ex) {
			Logger.getLogger(ExceptionHandlingPractice.class.getName()).log(Level.SEVERE, null, ex);
		}

	}

	private static void errorTest() throws IOException, ClassNotFoundException {

		try {
			Class.forName("com.mysql.jdbc.Driver");

			Path path = Paths.get("../../../sample/notfound.txt");
			Path realPath = path.toRealPath(LinkOption.NOFOLLOW_LINKS);

		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}

	}
}

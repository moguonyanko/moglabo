package exercise.database;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class BlobPractice {

	public static void main(String[] args) {
		File input = new File("/Users/hisako/src/moglabo/sample/sample.png");
		File output = new File("/Users/hisako/src/moglabo/sample/result.png");

		String url = "jdbc:mysql://localhost:3306/geolib";
		String user = "geofw", pass = "geofw";

		try (FileInputStream fis = new FileInputStream(input);
			FileOutputStream fos = new FileOutputStream(output);
			Connection con = DriverManager.getConnection(url, user, pass)) {

			String query = "INSERT INTO photo (id, image) VALUES (?, ?)";
			PreparedStatement statement = con.prepareStatement(query);
			statement.setInt(1, 1);
			statement.setBlob(2, fis, input.length());
			ResultSet rs = statement.executeQuery();

			while (rs.first()) {
				Blob image = rs.getBlob("image");
				InputStream imageStream = image.getBinaryStream();

				int data;

				while ((data = imageStream.read()) != -1) {
					fos.write(data);
				}
			}
		} catch (IOException | SQLException ex) {
			ex.printStackTrace();
		}
	}
}

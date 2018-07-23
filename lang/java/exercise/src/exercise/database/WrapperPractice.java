package exercise.database;

import com.mysql.jdbc.Connection;

import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;

public class WrapperPractice {

	/**
	 * @param args the command line arguments
	 */
	public static void main(String[] args) {
		String url = "jdbc:mysql://localhost:3306/geolib";
		String user = "geofw", pass = "geofw";
		
		/* usao is allowed 'SELECT' only */
		String newUser = "usao", newPassword = "usao";

		try (Connection con = (Connection)DriverManager.getConnection(url, user, pass)) {
			
			if(con.isWrapperFor(Connection.class)){
				Connection myCon = con.unwrap(Connection.class);
				
				myCon.changeUser(newUser, newPassword);
				System.out.println("RichUser changed " + newUser + " from " + user);
				
				Statement statement = myCon.createStatement();
				/* Next query is denied */
				statement.execute("INSERT INTO batchtest VALUES (0, 'sample0');");
				System.out.println("INSERT finished.");
			}
			
		} catch (SQLException ex) {
			Logger.getLogger(WrapperPractice.class.getName()).log(Level.SEVERE, null, ex);
		}
	}
}

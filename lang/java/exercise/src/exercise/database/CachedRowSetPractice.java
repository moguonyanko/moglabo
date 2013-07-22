package exercise.database;

import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.sql.RowSet;
import javax.sql.rowset.RowSetProvider;

public class CachedRowSetPractice {

	public static void main(String[] args) {

		String url = "jdbc:mysql://localhost:3306/geolib";
		String user = "geofw", pass = "geofw";

		try (RowSet rowSet = RowSetProvider.newFactory().createCachedRowSet();) {

			rowSet.setUsername(user);
			rowSet.setPassword(pass);
			rowSet.setUrl(url);
			rowSet.setCommand("SELECT * FROM featurecount");
			rowSet.execute();

			StringBuilder results = new StringBuilder();

			while (rowSet.next()) {
				results.append(rowSet.getString("feature"));
				results.append("¥n");
			}

			System.out.println(results.toString());

		} catch (SQLException ex) {
			Logger.getLogger(CachedRowSetPractice.class.getName()).log(Level.SEVERE, null, ex);
		}


	}
}

package exercise.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.sql.rowset.CachedRowSet;
import javax.sql.rowset.JdbcRowSet;
import javax.sql.rowset.RowSetProvider;

public class RowSetPractice {

	public static void main(String[] args) {

		String url = "jdbc:mysql://localhost:3306/geolib";
		String user = "geofw", pass = "geofw";

		try (JdbcRowSet rowSet = RowSetProvider.newFactory().createJdbcRowSet();
			//CachedRowSet rowSet = RowSetProvider.newFactory().createCachedRowSet();
			Connection con = DriverManager.getConnection(url, user, pass);) {

			//con.setAutoCommit(false);
			
			rowSet.setUsername(user);
			rowSet.setPassword(pass);
			rowSet.setUrl(url);
			rowSet.setCommand("SELECT * FROM featurecount");
			rowSet.execute();

			StringBuilder results = new StringBuilder();

			String target = "water";
			
			while (rowSet.next()) {
				if(rowSet.getString("feature").equals(target)){
					int count = rowSet.getInt("count");
					System.out.println(target + " count update!");
					rowSet.updateInt("count", count + 100);
					rowSet.updateRow();
					//rowSet.acceptChanges(con);
				}
				
				//results.append(rowSet.getString("feature"));
				//results.append("¥n");
			}

			System.out.println(results.toString());

		} catch (SQLException ex) {
			Logger.getLogger(RowSetPractice.class.getName()).log(Level.SEVERE, null, ex);
		}


	}
}

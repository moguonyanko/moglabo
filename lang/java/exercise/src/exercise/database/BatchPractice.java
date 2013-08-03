package exercise.database;

import java.sql.BatchUpdateException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;

public class BatchPractice {

	public static void main(String[] args) {

		String url = "jdbc:mysql://localhost:3306/geolib";
		String user = "geofw", pass = "geofw";

		try (Connection con = DriverManager.getConnection(url, user, pass)) {
			con.setAutoCommit(false);
			
			Statement statement = con.createStatement();
			statement.addBatch(BatchPractice.getSQL(1, "sample1"));
			statement.addBatch(BatchPractice.getSQL(2, "sample2"));
			statement.addBatch(BatchPractice.getSQL(2, "sample2"));

			try {
				statement.executeBatch();
				//con.commit();
			} catch (BatchUpdateException ex) {
				con.rollback();
				System.err.println("Rollbackded reason : " + ex.getMessage());
			}

		} catch (SQLException ex) {
			Logger.getLogger(BatchPractice.class.getName()).log(Level.SEVERE, null, ex);
		}
	}

	private static String getSQL(int id, String data) {
		String sqlHeader = "INSERT INTO batchtest VALUES (";
		String sqlFooter = ");";
		return sqlHeader + id + ", '" + data + "'" + sqlFooter;
	}
}

package exercise.database;

import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class WrapperPractice {

	public static void main(String[] args) {
		var url = "jdbc:mysql://localhost:3306/test";
		var user = "sampleuser";
		var pass = "samplepass";

		var newUser = "usao";
		var newPassword = "usapass";

		try (var con = DriverManager.getConnection(url, user, pass)) {

			var mysqlClass = com.mysql.cj.jdbc.ConnectionImpl.class;
			if(con.isWrapperFor(mysqlClass)){
				var myCon = con.unwrap(mysqlClass);

				// changeUserはunwrapされたMySQLのクラスを使う必要がある。
				myCon.changeUser(newUser, newPassword);
				System.out.println("User changed " + newUser + " from " + user);

				Statement statement = myCon.createStatement();
				statement.execute("INSERT INTO test.authors VALUES ('X001', 'Joe');");
				System.out.println("INSERT finished.");
				var rs = statement.executeQuery("SELECT * FROM test.authors;");
				while (rs.next()) {
					String name = rs.getString("name");
					System.out.println(name);
				}
			}

		} catch (SQLException ex) {
			System.err.println(ex.getMessage());
		}
	}
}

package practicejsf.bean;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.RequestScoped;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

@ManagedBean(name = "library", eager = true)
@RequestScoped
public class Library {

	private static final String RESOURCE_NAME = "jdbc/JSFTest";
	private static final String QUERY_SELECT_ALL_AUTHORS = "SELECT * FROM authors;";

	public List<Author> getAuthors() {
		List<Author> result = new ArrayList<Author>();

		Connection connection = null;
		try {
			Context context = new InitialContext();
			DataSource dataSource = (DataSource) context.lookup("java:comp/env/" + RESOURCE_NAME);
			connection = dataSource.getConnection();
			Statement statement = connection.createStatement();
			ResultSet rs = statement.executeQuery(QUERY_SELECT_ALL_AUTHORS);

			while (rs.next()) {
				int id = rs.getInt("id");
				String name = rs.getString("name");
				Author author = new Author(id, name);
				result.add(author);
			}
		} catch (NamingException ne) {
			System.err.println("データソース取得失敗:" + ne.getMessage());
		} catch (SQLException sqle) {
			System.err.println("レコード検索失敗:" + sqle.getMessage());
		} finally {
			try {
				if(connection != null){
					connection.close();
				}
			} catch (SQLException ex) {
				System.err.println("接続クローズ失敗:" + ex.getMessage());
			}
		}

		return result;
	}

}

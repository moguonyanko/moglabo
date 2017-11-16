package practicejsf.bean;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.RequestScoped;
import javax.naming.InitialContext;
import javax.naming.NamingException;

@ManagedBean(name = "library", eager = true)
@RequestScoped
public class Library {

	private static final String RESOURCE_NAME = "jdbc/JSFTest";
	private static final String QUERY_SELECT_ALL_AUTHORS = "SELECT * FROM authors;";

	public List<Author> getAuthors() {
		List<Author> result = new ArrayList<>();

		DataSource dataSource;
		try {
			dataSource = (DataSource) new InitialContext().lookup("java:comp/env/" + RESOURCE_NAME);
		} catch (NamingException ex) {
			System.err.println("データソース取得失敗:" + ex.getMessage());
			return result;
		}
		
		try(Connection connection = dataSource.getConnection()) {
			Statement statement = connection.createStatement();
			ResultSet rs = statement.executeQuery(QUERY_SELECT_ALL_AUTHORS);

			while (rs.next()) {
				String id = rs.getString("id");
				String name = rs.getString("name");
				Author author = new Author(id, name);
				result.add(author);
			}
		} catch (SQLException sqle) {
			System.err.println("レコード検索失敗:" + sqle.getMessage());
		} 

		return result;
	}

}

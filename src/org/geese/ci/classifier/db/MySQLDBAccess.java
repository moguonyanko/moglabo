package org.geese.ci.classifier.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import org.geese.ci.classifier.util.ConfigUtil;

/**
 * RDBMS Access data.
 *
 */
public enum MySQLDBAccess implements DBAccess {

	DBACCESS;
	
	private final String jdbcUrl;
	private final String userId;
	private final String password;

	private final String DBNAME = "MySQL";
	
	MySQLDBAccess() {
		String name = ConfigUtil.getValue("db.name");
		String host = ConfigUtil.getValue("db.host");
		String port = ConfigUtil.getValue("db.port");
		String database = ConfigUtil.getValue("db.database");

		StringBuilder url = new StringBuilder("jdbc:");
		url.append(name).append(":").append("//");
		url.append(host).append(":").append(port).append("/");
		url.append(database);
		jdbcUrl = url.toString();

		userId = ConfigUtil.getValue("db.user");
		password = ConfigUtil.getValue("db.password");
	}

	@Override
	public Connection connect() throws SQLException {
		Connection con = DriverManager.getConnection(jdbcUrl, userId, password);
		con.setAutoCommit(false);

		return con;
	}

	@Override
	public String getDBName(){
		return DBNAME;
	}
}

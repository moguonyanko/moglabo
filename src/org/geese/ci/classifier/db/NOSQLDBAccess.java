package org.geese.ci.classifier.db;

import java.sql.Connection;
import java.sql.SQLException;

/**
 * NOSQL access data.
 * 
 */
public enum NOSQLDBAccess implements DBAccess {

	DBACCESS;

	@Override
	public Connection connect() throws SQLException {
		/**
		 * @todo implement
		 */
		return null;
	}
}

package org.geese.ci.classifier.db;

import java.sql.Connection;
import java.sql.SQLException;

/**
 * NOSQL access data.
 * 
 */
public enum MongoDBDBAccess implements DBAccess {

	DBACCESS;
	
	private final String DBNAME = "MongoDB";

	@Override
	public Connection connect() throws SQLException {
		/**
		 * @todo implement
		 */
		return null;
	}

	@Override
	public String getDBName(){
		return DBNAME;
	}
}

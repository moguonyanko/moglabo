package org.geese.ci.classifier.db;

public class DBAccessFactory {

	public static DBAccess create(String dbName) {

		if (dbName == null) {
			throw new IllegalArgumentException("Database name is null.");
		}

		if (dbName.equalsIgnoreCase(MySQLDBAccess.DBACCESS.getDBName())) {
			return MySQLDBAccess.DBACCESS;
		} else if (dbName.equalsIgnoreCase(MongoDBDBAccess.DBACCESS.getDBName())) {
			return MongoDBDBAccess.DBACCESS;
		} else {
			throw new UnsupportedOperationException("Unsupported database name requested.");
		}
	}
}

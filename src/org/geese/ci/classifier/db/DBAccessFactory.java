package org.geese.ci.classifier.db;

public class DBAccessFactory {

	public static DBAccess create(String type) {

		if (type == null) {
			throw new IllegalArgumentException("DB type is null.");
		}

		if (type.equalsIgnoreCase("RDBMS")) {
			return RDBMSDBAccess.DBACCESS;
		} else if (type.equalsIgnoreCase("NOSQL")) {
			return NOSQLDBAccess.DBACCESS;
		} else {
			throw new UnsupportedOperationException("Unsupported DB type requested.");
		}
	}
}

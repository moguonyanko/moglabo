package org.geese.ci.classifier.db.dao;

import java.sql.Connection;

import org.geese.ci.classifier.db.MongoDBDBAccess;
import org.geese.ci.classifier.db.MySQLDBAccess;
import org.geese.ci.classifier.db.dao.mongodb.MongoDBCategoryCountDao;
import org.geese.ci.classifier.db.dao.mongodb.MongoDBFeatureCountDao;
import org.geese.ci.classifier.db.dao.mysql.MySQLCategoryCountDao;
import org.geese.ci.classifier.db.dao.mysql.MySQLFeatureCountDao;

public class DaoFactory{

	public static FeatureCountDao createFeatureCountDao(String dbName, Connection connection){
		if(dbName == null){
			throw new IllegalArgumentException("Database name is null.");
		}

		if(dbName.equalsIgnoreCase(MySQLDBAccess.DBACCESS.getDBName())){
			return new MySQLFeatureCountDao(connection);
		}else if(dbName.equalsIgnoreCase(MongoDBDBAccess.DBACCESS.getDBName())){
			return new MongoDBFeatureCountDao(connection);
		}else{
			throw new UnsupportedOperationException("Unsupported database type requested.");
		}
	}

	public static CategoryCountDao createCategoryCountDao(String dbType, Connection connection){
		if(dbType == null){
			throw new IllegalArgumentException("Database type is null.");
		}

		if(dbType.equalsIgnoreCase(MySQLDBAccess.DBACCESS.getDBName())){
			return new MySQLCategoryCountDao(connection);
		}else if(dbType.equalsIgnoreCase(MongoDBDBAccess.DBACCESS.getDBName())){
			return new MongoDBCategoryCountDao(connection);
		}else{
			throw new UnsupportedOperationException("Unsupported database type requested.");
		}
	}
}

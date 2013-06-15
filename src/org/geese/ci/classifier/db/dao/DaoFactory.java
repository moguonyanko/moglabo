package org.geese.ci.classifier.db.dao;

import java.sql.Connection;
import org.geese.ci.classifier.db.dao.rdbms.RDBMSCategoryCountDao;
import org.geese.ci.classifier.db.dao.rdbms.RDBMSFeatureCountDao;

public class DaoFactory {
	
	public static FeatureCountDao createFeatureCountDao(String dbType, Connection connection){
		if(dbType == null){
			throw new IllegalArgumentException("Database type is null.");
		}
		
		if(dbType.equalsIgnoreCase("RDBMS")){
			return new RDBMSFeatureCountDao(connection);
		}else if(dbType.equalsIgnoreCase("NOSQL")){
			throw new UnsupportedOperationException("Unsupported database type requested.");
		}else{
			throw new UnsupportedOperationException("Unsupported database type requested.");
		}
	}
	
	public static CategoryCountDao createCategoryCountDao(String dbType, Connection connection){
		if(dbType == null){
			throw new IllegalArgumentException("Database type is null.");
		}
		
		if(dbType.equalsIgnoreCase("RDBMS")){
			return new RDBMSCategoryCountDao(connection);
		}else if(dbType.equalsIgnoreCase("NOSQL")){
			throw new UnsupportedOperationException("Unsupported database type requested.");
		}else{
			throw new UnsupportedOperationException("Unsupported database type requested.");
		}
	}
}

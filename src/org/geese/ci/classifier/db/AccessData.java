package org.geese.ci.classifier.db;

import org.geese.ci.classifier.conf.CIConfig;

/**
 * DB Access data.
 * 
 * @todo
 * Should change abstract class.
 * 
 */
public class AccessData {
	
	private static final String driverName;
	private static final String jdbcUrl;
	private static final String userId;
	private static final String password;
	
	static {
		driverName = CIConfig.getValue("db.drivername");
		jdbcUrl = CIConfig.getValue("db.url");
		userId = CIConfig.getValue("db.user");
		password = CIConfig.getValue("db.password");
	}

	public static String getDriverName(){
		return driverName;
	}

	public static String getURL(){
		return jdbcUrl;
	}

	public static String getUserId(){
		return userId;
	}

	public static String getPassword(){
		return password;
	}
	
}

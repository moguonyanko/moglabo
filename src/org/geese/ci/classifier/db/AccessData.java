package org.geese.ci.classifier.db;

import org.geese.ci.classifier.util.ConfigUtil;

/**
 * DB Access data.
 * 
 * @todo
 * Should change abstract class.
 * Maybe should move to ResouceUtil class.
 * 
 */
public class AccessData {
	
	private static final String jdbcUrl = ConfigUtil.getValue("db.url");
	private static final String userId = ConfigUtil.getValue("db.user");
	private static final String password = ConfigUtil.getValue("db.password");
	
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

package org.geese.ci.classifier.util;

import java.sql.Connection;
import java.sql.SQLException;

public class ResourceUtil{

	public static void close(Connection con){
		try{
			con.close();
		}catch(SQLException ex){
			LogUtil.error("Fail to close database connection." + ex.getMessage());
		}
	}
}

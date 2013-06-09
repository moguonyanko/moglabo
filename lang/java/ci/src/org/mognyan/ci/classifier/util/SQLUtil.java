package org.mognyan.ci.classifier.util;

import java.sql.Connection;
import java.sql.SQLException;

public class SQLUtil{

	public static void closeConnection(Connection con){
		try{
			con.close();
		}catch(SQLException ex1){
			LogUtil.error("Fail to close database connection.");
		}
	}
}

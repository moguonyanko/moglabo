package org.mognyan.ci.classifier.util;

import java.sql.Connection;
import java.sql.SQLException;

public class SQLUtil{

	public static void rollbackConnection(Connection con){
		if(con != null){
			try{
				if(!con.isClosed()){
					con.rollback();
					con.close();
				}
			}catch(SQLException ex){
				ex.printStackTrace();
			}
		}
	}

	public static void closeConnection(Connection con){
		try{
			con.close();
		}catch(SQLException ex1){
			ex1.printStackTrace();
		}
	}
}

package org.mognyan.ci.db.dao;

import java.sql.Connection;

public abstract class AbstractDao{
	
	private final Connection connection;

	public AbstractDao(Connection connection){
		this.connection = connection;
	}

	public Connection getConnection(){
		return connection;
	}
}

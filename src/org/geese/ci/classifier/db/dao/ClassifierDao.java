package org.geese.ci.classifier.db.dao;

import java.sql.Connection;

public abstract class ClassifierDao {

	private final Connection connection;

	public ClassifierDao(Connection connection) {
		this.connection = connection;
	}

	public Connection getConnection() {
		return connection;
	}
	
	//abstract <T> double select(T target);
}

package org.geese.ci.classifier.db.dao;

import java.sql.Connection;
import java.sql.SQLException;

import org.geese.ci.classifier.Feature;

public abstract class FeatureCountDao extends ClassifierDao{

	public FeatureCountDao(Connection connection) {
		super(connection);
	}
	
	public abstract boolean insert(Feature feature) throws SQLException;
	public abstract double select(Feature feature) throws SQLException;
	public abstract int update(double count, Feature feature) throws SQLException;
	
}

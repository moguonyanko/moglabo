package org.geese.ci.classifier.db.dao;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Set;

import org.geese.ci.classifier.Category;

public abstract class CategoryCountDao extends ClassifierDao{

	public CategoryCountDao(Connection connection) {
		super(connection);
	}
	
	public abstract boolean insert(Category category) throws SQLException;
	public abstract double select(Category category) throws SQLException;
	public abstract Set<String> findAllCategories() throws SQLException;
	public abstract List<Double> findAllCounts() throws SQLException;
	public abstract int update(double count, Category category) throws SQLException;
}

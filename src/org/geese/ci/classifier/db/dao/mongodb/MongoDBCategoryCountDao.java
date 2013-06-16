package org.geese.ci.classifier.db.dao.mongodb;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Set;
import org.geese.ci.classifier.Category;
import org.geese.ci.classifier.db.dao.CategoryCountDao;

public class MongoDBCategoryCountDao extends CategoryCountDao {

	public MongoDBCategoryCountDao(Connection connection){
		super(connection);
	}
	

	@Override
	public boolean insert(Category category) throws SQLException{
		throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
	}

	@Override
	public double select(Category category) throws SQLException{
		throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
	}

	@Override
	public Set<String> findAllCategories() throws SQLException{
		throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
	}

	@Override
	public List<Double> findAllCounts() throws SQLException{
		throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
	}

	@Override
	public int update(double count, Category category) throws SQLException{
		throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
	}
	
}

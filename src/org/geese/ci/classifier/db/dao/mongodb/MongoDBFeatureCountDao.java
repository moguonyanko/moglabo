package org.geese.ci.classifier.db.dao.mongodb;

import java.sql.Connection;
import java.sql.SQLException;
import org.geese.ci.classifier.Feature;
import org.geese.ci.classifier.db.dao.FeatureCountDao;

public class MongoDBFeatureCountDao extends FeatureCountDao{

	public MongoDBFeatureCountDao(Connection connection){
		super(connection);
	}

	@Override
	public boolean insert(Feature feature) throws SQLException{
		throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
	}

	@Override
	public double select(Feature feature) throws SQLException{
		throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
	}

	@Override
	public int update(double count, Feature feature) throws SQLException{
		throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
	}
	
}
